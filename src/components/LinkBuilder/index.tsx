// QuickLinkDrawer.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* ---------- styled ---------- */
const Drawer = styled.details`
  width: 260px;
  margin: 0 0 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,.08);
  &[open] summary { background: #f5f5f5; }
`;
const Summary = styled.summary`
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
`;
const Body = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const Input = styled.input`
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.9rem;
`;
const Btn = styled.button`
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #4c8c2b;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  &:disabled { opacity: .6; cursor: not-allowed; }
`;

/* ---------- component ---------- */
const QuickLinkDrawer = () => {
  const [orgId, setOrgId]     = useState("");
  const [serviceName, setserviceName]   = useState("");
  const navigate              = useNavigate();

  const go = () =>
    navigate(`/PreserveCards?orgId=${orgId}&serviceName=${serviceName}`);

  return (
    <Drawer>
      <Summary>Preserve Cards</Summary>
      <Body>
        <Input
          type="text"
          placeholder="orgId"
          value={orgId}
          onChange={(e) => setOrgId(e.target.value.trim())}
        />
        <Input
          type="text"
          placeholder="serviceName"
          value={serviceName}
          onChange={(e) => setserviceName(e.target.value.trim())}
        />
        <Btn disabled={!orgId || !serviceName} onClick={go}>
          Go
        </Btn>
      </Body>
    </Drawer>
  );
};

export default QuickLinkDrawer;
