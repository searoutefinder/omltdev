export function loadImageAsync(map: mapboxgl.Map, name: string, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (map.hasImage(name)) {
      resolve();
      return;
    }
    map.loadImage(url, (error, image) => {
      if (error) {
        reject(error);
        return;
      }
      if (!map.hasImage(name) && image) {
        map.addImage(name, image);
      }
      resolve();
    });
  });
}