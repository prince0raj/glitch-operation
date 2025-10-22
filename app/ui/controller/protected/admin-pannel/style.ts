import styled from "styled-components";

export const AdminPannelContainer = styled.section`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;
  background: #05060a;
  color: #e2e8f0;
  overflow: hidden;
`;

export const AdminBackdrop = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`;

export const AdminPannelWrapper = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  align-items: stretch;
`;

export const AdminSidebar = styled.aside`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 1.75rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(0, 212, 146, 0.18);
  background: radial-gradient(
    circle at top,
    rgba(0, 212, 146, 0.08),
    rgba(5, 6, 10, 0.92)
  );
  box-shadow: 0 25px 50px rgba(5, 6, 10, 0.65);
  backdrop-filter: blur(16px);
`;

export const AdminSidebarHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export const AdminSidebarTitle = styled.h2`
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.95);
`;

export const AdminSidebarSubtitle = styled.p`
  font-size: 0.85rem;
  color: rgba(148, 163, 184, 0.8);
`;

export const AdminSidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

export const AdminContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: 2.5rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(0, 212, 146, 0.12);
  background: linear-gradient(
    170deg,
    rgba(8, 11, 19, 0.92),
    rgba(6, 8, 14, 0.75)
  );
  box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.1),
    0 28px 70px rgba(3, 7, 18, 0.4);
  backdrop-filter: blur(20px);
`;

export const AdminContentHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const AdminContentTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.98);
`;

export const AdminContentDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(148, 163, 184, 0.85);
`;

export const AdminQuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const AdminQuickActionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(0, 212, 146, 0.15);
  background: rgba(8, 12, 18, 0.85);
  box-shadow: 0 16px 40px rgba(5, 6, 10, 0.35);
`;

export const AdminQuickActionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: rgba(226, 232, 240, 0.92);
`;

export const AdminQuickActionDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(148, 163, 184, 0.85);
`;
