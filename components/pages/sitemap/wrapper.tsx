
import { defaultLanguage } from "../../../config/locale";
import Link from 'next/link';
import styled from '@emotion/styled';
import { useT } from "../../../lib/i18n";
import { useLanguage } from "../../../lib/routing"
import { getTranslation } from "../../../lib/translations";
import { useHandleActiveOrganizer, useOrganizerId } from "../../../lib/useOrganizer";
import { EntryFormContainer, EntryFormWrapper } from "../../EntryForm/wrappers";
import { EntryHeader } from "../../EntryHeader"
import { useUser, useUserOrganizerLists } from "../../user/useUser";
import { useMemo } from "react";
import { appLayouts, useLayout } from "../../layouts/AppLayout";
import { useMenuStructure } from "../../../config/structure";
import { useCategories } from "../../../config/categories";
import { OfferList } from "../../../lib/api";
import { Offer } from "../../../lib/api/types/offer";
import { useList } from "../../../lib/categories";
import { defaultOrganizerId } from "../../navigation/NavigationContext";

const StyledLinkList = styled.ul`

`;

const StyledLink = styled.li<{ level: number }>`
  margin-left: ${({ level }) => (level * 2 )}rem;
  margin-bottom: 1.5rem;
`;

interface SitemapContainerProps {
  organizerId? :string;
}

export const SitemapContainer: React.FC<SitemapContainerProps> = ({}: SitemapContainerProps) => {
  const language = useLanguage();
  const t = useT();
  const organizerLists = useUserOrganizerLists();
  const organizerId = useOrganizerId();
  const categories = useCategories();

  const NavigationStructure = useMenuStructure();

  const offers = useList<OfferList, Offer>(
    categories.offer,
    1,
    1,
    [['organizers', organizerId]],
    undefined,
    organizerId !== defaultOrganizerId
  );

  const locations = useList<OfferList, Offer>(
    categories.location,
    1,
    1,
    [['organizer', organizerId]],
    undefined,
    organizerId !== defaultOrganizerId
  );

  const hasOffers = useMemo(() => offers?.data?.length > 0, [offers]);
  const hasLocations = useMemo(() => locations?.data?.length > 0, [locations]);

  const level_1_links = useMemo(() => {return NavigationStructure.header.loggedIn.menuItems.filter(item => item.type === 'link')}, [ NavigationStructure ])
  const level_2_links = useMemo(() => {return NavigationStructure.menus}, [ NavigationStructure ])
  const organizer = organizerLists.all.filter(organizer => organizer.id === organizerId)[0] || undefined
  
  const organizerHandler = useHandleActiveOrganizer()
  console.log("LINKs",organizerHandler)

  const currentTranslation = organizer ? getTranslation(language, organizer.relations?.translations, true) : undefined
  const defaultTranslation = organizer ? getTranslation(defaultLanguage, organizer.relations?.translations, true) : undefined

  const subTitle = 
    currentTranslation?.attributes?.name ||
    defaultTranslation?.attributes?.name ||
    (t('general.placeholderOrganizer') as string)

  return (
    <>
      <EntryHeader 
        title="Sitemap"
        subTitle={subTitle}
      />
      <EntryFormWrapper>
        <EntryFormContainer>
          <StyledLinkList>
            {level_1_links.map((topic, index) => (
              <StyledLink level={0} key={index}>
                <Link href={topic.action.href}>{topic.action.title || ''}</Link>
              </StyledLink>
            ))}
            
            <StyledLinkList>
              <StyledLink level={1}>
                <Link href={''}>LEVEL_1</Link>
              </StyledLink>
              <StyledLinkList>
              <StyledLink level={2}>
                <Link href={''}>LEVEL_2</Link>
              </StyledLink>
            </StyledLinkList>
            </StyledLinkList>
          </StyledLinkList>
        </EntryFormContainer>
      </EntryFormWrapper>
    </>
  )
}