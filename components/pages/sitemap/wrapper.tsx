
import { defaultLanguage } from "../../../config/locale";
import Link from 'next/link';
import styled from '@emotion/styled';
import { useT } from "../../../lib/i18n";
import { routes, Routes, useLanguage, useLocale } from "../../../lib/routing"
import { getTranslation } from "../../../lib/translations";
import { useHandleActiveOrganizer, useOrganizerId } from "../../../lib/useOrganizer";
import { EntryFormContainer, EntryFormWrapper } from "../../EntryForm/wrappers";
import { EntryHeader } from "../../EntryHeader"
import { useUser, useUserOrganizerLists } from "../../user/useUser";
import { useEffect, useMemo, useState } from "react";
import { appLayouts, useLayout } from "../../layouts/AppLayout";
import { useMenuStructure } from "../../../config/structure";
import { Categories, useCategories } from "../../../config/categories";
import { OfferList } from "../../../lib/api";
import { Offer, OfferTranslation, OfferTypeTranslation } from "../../../lib/api/types/offer";
import { useList } from "../../../lib/categories";
import { defaultOrganizerId } from "../../navigation/NavigationContext";
import { LocationTranslation } from "../../../lib/api/types/location";
import router from "next/router";
import { PublishedStatus } from "../../../lib/api/types/general";
import { EntryCard, EntryCardTypesSubjects } from "../../EntryList/EntryCard";

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
  const [lastPage, setLastPage] = useState<number>();
  const [totalEntries, setTotalEntries] = useState<number>();
  const locale = useLocale();

  const NavigationStructure = useMenuStructure();

  const offerList = useList<OfferList, Offer>(
    categories.offer,
    lastPage,
    totalEntries,
    [['organizers', organizerId]],
    undefined,
    organizerId !== defaultOrganizerId
  );

  const locationList = useList<OfferList, Offer>(
    categories.location,
    lastPage,
    totalEntries,
    [['organizer', organizerId]],
    undefined,
    organizerId !== defaultOrganizerId
  );


  const offers = useMemo(
    () =>
      offerList?.data
        ? Object.values(Array.isArray(offerList.data) ? offerList.data : [offerList.data]).map(
            ({ attributes, relations, id }) => {

              const href = (sub?: string) =>
                routes[Routes.offer]({
                  locale,
                  query: { organizer: organizerId, id, sub },
                });

              const translations = relations?.translations;

              const currentTranslation = translations
                ? getTranslation<OfferTranslation>(language, translations)
                : undefined;

              const defaultTranslation = translations
                ? getTranslation<OfferTranslation>(defaultLanguage, translations)
                : undefined;

              const translation = 
                currentTranslation.attributes.name ?
                currentTranslation.attributes.name :
                defaultTranslation.attributes.name ?
                defaultTranslation.attributes.name :
                t('general.placeholderOffer')

              return {
                href: href('info'),
                translation
              }
            }
          )
        : undefined,
    [
      language,
      offerList.data,
      locale,
      organizerId,
      t
    ]
  );


  const locations = useMemo(
    () =>
      locationList?.data
        ? Object.values(Array.isArray(locationList.data) ? locationList.data : [locationList.data]).map(
            ({ attributes, relations, id }) => {

              const href = (sub?: string) =>
                routes[Routes.offer]({
                  locale,
                  query: { organizer: organizerId, id, sub },
                });

              const translations = relations?.translations;

              const currentTranslation = translations
                ? getTranslation<OfferTranslation>(language, translations)
                : undefined;

              const defaultTranslation = translations
                ? getTranslation<OfferTranslation>(defaultLanguage, translations)
                : undefined;

              const translation = 
                currentTranslation.attributes.name ?
                currentTranslation.attributes.name :
                defaultTranslation.attributes.name ?
                defaultTranslation.attributes.name :
                t('general.placeholderLocation')

              return {
                href: href('info'),
                translation
              }
            }
          )
        : undefined,
    [
      language,
      locationList.data,
      locale,
      organizerId,
      t
    ]
  );


  const level_1_links = useMemo(() => {return NavigationStructure.header.loggedIn.menuItems.filter(item => item.type === 'link')}, [ NavigationStructure ])
  const level_2_links = useMemo(() => {return NavigationStructure.menus}, [ NavigationStructure ])
  
  const organizer = organizerLists.all.filter(organizer => organizer.id === organizerId)[0] || undefined

  const organizerCurrentTranslation = organizer ? getTranslation(language, organizer.relations?.translations, true) : undefined
  const organizerDefaultTranslation = organizer ? getTranslation(defaultLanguage, organizer.relations?.translations, true) : undefined

  const organizerSubTitle = 
    organizerCurrentTranslation?.attributes?.name ||
    organizerDefaultTranslation?.attributes?.name ||
    (t('general.placeholderOrganizer') as string)

  return (
    <>
      <EntryHeader 
        title="Sitemap"
        subTitle={organizerSubTitle}
      />
      <EntryFormWrapper>
        <EntryFormContainer>
          <StyledLinkList>
            {level_1_links.map((topic, index) => (
              <StyledLink level={0} key={index}>
                <Link href={topic.action.href}>{topic.action.title || ''}</Link>
                {index === 1 && offers && offers.map((offer, index) => (
                  <StyledLink key={index} level={1}>
                    <Link href={offer?.href as string}>{offer.translation}</Link>
                  </StyledLink>
                ))}
                {index === 2 && locations && locations.map((offer, index) => (
                  <StyledLink key={index} level={1}>
                    <Link href={offer?.href as string}>{offer.translation}</Link>
                  </StyledLink>
                ))}
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