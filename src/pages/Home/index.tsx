import React, { useState } from "react";
import { PageWrapper, SectionsWrapper, StyledSectionButton, HeroSection, LogoImg, Container, Folder, Summary, StyledButton, TitleSection, StyledLink, ItemTitle } from "./Elements";
import QuickLinkDrawer from "../../components/LinkBuilder"

const HomePage = () => {
  const [view, setView] = useState<"general" | "linkbuilder" | "iframeBuilder">("general");
  const orgId = "TkSpD6kCAXkp8Jk5";

  //#TAMAS comments: This will be also fetched from DB - each client will have its own orgId and serviceName. Now lets keep it hardcoded
  const serviceName = "LGLC_OMLT";
  //const serviceNameWalkMaps = "Saranac_Lake_Riverwalk_Trail";
  const serviceNameWalkMaps = "SLRiverwalk";

  return (
    <PageWrapper>
      <Container>
      <TitleSection>
        OMLT - Admin Panel
        <LogoImg src='/img/vector/logo.svg' alt='logo' />
      </TitleSection>
      <SectionsWrapper>
        <StyledSectionButton 
           $isSelected={view === "general"}
           onClick={() => setView("general")} disabled={view === "general"}>
          General
        </StyledSectionButton>
        <StyledSectionButton 
          $isSelected={view === "linkbuilder"}
           onClick={() => setView("linkbuilder")} disabled={view === "linkbuilder"}>
          Link Builder
        </StyledSectionButton>
        <StyledSectionButton 
          $isSelected={view === "iframeBuilder"}>
          Iframe Builder
        </StyledSectionButton>
      </SectionsWrapper>
      <HeroSection>
        {view === "general" && (
          <>
            <Folder>
              <Summary>📁 Preserve Maps</Summary>
              <StyledLink to={`/SchumannPreserve?orgId=${orgId}&serviceName=${serviceName}`}>
                <StyledButton >
                  Schumann Preserve
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_OMLT
                  </ItemTitle>
                </StyledButton>
              </StyledLink>
              <StyledLink to={`/BerryPondPreserve?orgId=${orgId}&serviceName=${serviceName}`}>
                <StyledButton >
                  Berry Pond Preserve
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_OMLT
                  </ItemTitle>
                </StyledButton>
              </StyledLink>
              <StyledLink to={`/ThePinnaclePreserve?orgId=${orgId}&serviceName=${serviceName}`}>
                <StyledButton >
                  The Pinnacle Preserve
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_OMLT
                  </ItemTitle>
                </StyledButton>
              </StyledLink>
              <StyledLink to={`/PeggysPoint?orgId=${orgId}&serviceName=${serviceName}`}>
                <StyledButton >
                  Peggy&apos;s Point
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_OMLT
                  </ItemTitle>
                </StyledButton>
              </StyledLink>
              <StyledLink to={`/LeemingJelliffePreserve?orgId=${orgId}&serviceName=${serviceName}`}>
                <StyledButton >
                  Leeming Jelliffe Preserve
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_OMLT
                  </ItemTitle>
                </StyledButton>
              </StyledLink>
              <StyledLink to={`/GodwinPreserve?orgId=${orgId}&serviceName=${serviceName}`}>
                <StyledButton >
                  Godwin Preserve
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_OMLT
                  </ItemTitle>
                </StyledButton>
              </StyledLink>
              <StyledLink to={`/TerzianWoodlotPreserve?orgId=${orgId}&serviceName=${serviceName}`}>
                <StyledButton >
                  Terzian Woodlot Preserve
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_OMLT
                  </ItemTitle>
                </StyledButton>
              </StyledLink>
              <StyledLink to={`/AnthonysNosePreserve?orgId=${orgId}&serviceName=${serviceName}`}>
                <StyledButton >
                  Anthony&apos;s Nose Preserve
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_OMLT
                  </ItemTitle>
                </StyledButton>
              </StyledLink>
              <StyledLink to={`/CookMountain?orgId=${orgId}&serviceName=${serviceName}`}>
                <StyledButton >
                  Cook Mountain
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_OMLT
                  </ItemTitle>
                </StyledButton>
              </StyledLink>
              <StyledLink to={`/PoleHillPond?orgId=${orgId}&serviceName=${serviceName}`}>
                <StyledButton >
                  Pole Hill Pond
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_OMLT
                  </ItemTitle>
                </StyledButton>
              </StyledLink>
              <StyledLink to={`/SuckerBrook?orgId=${orgId}&serviceName=${serviceName}`}>
                <StyledButton >
                  Sucker Brook
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_OMLT
                  </ItemTitle>
                </StyledButton>
              </StyledLink>

                <StyledLink to={`/CatThomasMountainsPreserve?orgId=${orgId}&serviceName=${serviceName}`}>
                <StyledButton >
                  Cat & Thomas Mountains Preserve
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_OMLT
                  </ItemTitle>
                </StyledButton>
              </StyledLink>


                <StyledLink to={`/AmysParkPreserve?orgId=${orgId}&serviceName=${serviceName}`}>
                <StyledButton >
                  Amy&apos;s Park Preserve
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_OMLT
                  </ItemTitle>
                </StyledButton>
              </StyledLink>


            </Folder>
            <Folder>
              <Summary>📁 Walk Maps</Summary>
              <StyledLink to={`/walkmaps/walkmaps?orgId=${orgId}&serviceName=${serviceNameWalkMaps}`}>
                <StyledButton>
                  Saranac River Walk
                  <ItemTitle>
                    <b>Item Title:</b> Saranac River Walk
                  </ItemTitle>
                </StyledButton>
              </StyledLink>
            </Folder>            
            <Folder>
              <Summary>📁 Boundary Maps</Summary>
              <StyledLink to="/LGLCBoundaries">
                <StyledButton>
                  LGLC Boundaries
                  <ItemTitle>
                    <b>Item Title:</b> LGLC_CustomMaps_GIS
                  </ItemTitle>
                </StyledButton>
              </StyledLink>
            </Folder>
            <Folder>
              <Summary>📁 Rising Routes</Summary>
              <StyledLink to="/RisingRoutes">
                <StyledButton>
                  Rising Routes
                  <ItemTitle>
                    <b>Item Title:</b> RisingRoutesOrganizations
                  </ItemTitle>
                </StyledButton>
              </StyledLink>
            </Folder>
            <Folder>
              <Summary>📁 Web Forms</Summary>
              <StyledLink to="/SubmissionForm">
                <StyledButton>
                  Data Submission Form
                </StyledButton>
              </StyledLink>
            </Folder>
          </>
        )}
        {view === "linkbuilder" && (
          <Folder>
            <Summary>🔗 Link Builder</Summary>
            <QuickLinkDrawer />
          </Folder>
        )}
      </HeroSection>
    </Container>
     </PageWrapper> 
    
  );
};

export default HomePage;
