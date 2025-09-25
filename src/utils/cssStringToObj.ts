const cssStringToObject = (css: string): React.CSSProperties => {
    return css
      .split(";")
      .map(r => r.trim())
      .filter(Boolean)
      .reduce((acc, rule) => {
        const [rawProp, ...rest] = rule.split(":");
        if (!rawProp || !rest.length) return acc;
        const value = rest.join(":").trim();
        const camelProp = rawProp.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        (acc as any)[camelProp] = value;
        return acc;
      }, {} as React.CSSProperties);
}

export default cssStringToObject;