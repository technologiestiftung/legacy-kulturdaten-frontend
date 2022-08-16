
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
import { Location } from "../../../lib/api/types/location";
import { Offer, OfferTranslation, OfferTypeTranslation } from "../../../lib/api/types/offer";
import { useList } from "../../../lib/categories";
import { defaultOrganizerId } from "../../navigation/NavigationContext";
import { LocationTranslation } from "../../../lib/api/types/location";
import router from "next/router";
import { PublishedStatus } from "../../../lib/api/types/general";
import { EntryCard, EntryCardTypesSubjects } from "../../EntryList/EntryCard";
import { LocationList } from '../../../lib/api/routes/location/list'
import { H1Svg } from "../../assets/H1Svg";

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
  const locale = useLocale();

  const NavigationStructure = useMenuStructure();

  const offerList = useList<OfferList, Offer>(
    categories.offer,
    undefined,
    undefined,
    [['organizers', organizerId]],
    undefined,
    organizerId !== defaultOrganizerId
  );

  const locationList = useList<LocationList, Location>(
    categories.location,
    undefined,
    undefined,
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
                translation,
                id
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
                ? getTranslation<LocationTranslation>(language, translations)
                : undefined;

              const defaultTranslation = translations
                ? getTranslation<LocationTranslation>(defaultLanguage, translations)
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
  const level_2_links = useMemo(() => {return NavigationStructure.menus.filter(item => item)}, [ NavigationStructure ])

  console.log("NAV-Strukture", level_1_links[2])
  
  const dahboardLinks = [
    {
      href: `${level_1_links[0].action.href}#${t('dashboard.info.linkList.quicklinks.id')}`,
      title: t('dashboard.info.linkList.quicklinks.title')
    },
    {
      href: `${level_1_links[0].action.href}#${t('dashboard.info.linkList.help.id')}`,
      title: t('dashboard.info.linkList.help.title')
    },
    {
      href: `${level_1_links[0].action.href}#${t('dashboard.info.linkList.openSource.id')}`,
      title: t('dashboard.info.linkList.openSource.title')
    },
    {
      href: `${level_1_links[0].action.href}#${t('dashboard.info.linkList.contact.id')}`,
      title: t('dashboard.info.linkList.contact.title')
    },
  ]

  const offerLinks = (offerID) => { 
    const subs = ['info','categorization','dates','audience','media']
    return subs.map(sub => {
      return {
        href: `${level_1_links[1].action.href}${offerID}/${sub}`,
        title: t(`categories.offer.tabs.${sub}`)
      }
    })
  }

  // const locationLinks = (locationID) => {}

  const organizerLinks = [
    {
      href: `${level_1_links[4].action.href.slice(0,-5)}info`,
      title: t('categories.organizer.tabs.info')
    },
    {
      href: `${level_1_links[4].action.href.slice(0,-5)}categorization`,
      title: t('categories.organizer.tabs.categorization')
    },
    {
      href: `${level_1_links[4].action.href.slice(0,-5)}media`,
      title: t('categories.organizer.tabs.media')
    },
  ]


  // const locationLinks = [
  //   {
  //     href: `${level_1_links[0].action.href}/#${t('dashboard.info.linkList.quicklinks.id')}`,
  //     title: t('categories.location.form.tabs')
  //   },
  // ]
  
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
                <StyledLinkList>
                  <StyledLink level={1}>
                    <Link href={topic.action.href}>{topic.action.title || ''}</Link>
                  </StyledLink>
                  <StyledLink level={1}>
                    <StyledLinkList>
                      {index === 0 && dahboardLinks.map((link, index) => (
                        <StyledLink key={index} level={1}>
                          <Link href={link.href as string}>{link.title}</Link>
                        </StyledLink>
                      ))}
                    </StyledLinkList>
                  </StyledLink>
                  <StyledLink level={1}>
                    <StyledLinkList>
                      {index === 1 && offers && offers.map(({href, translation, id}, index) => (
                          <StyledLink key={index} level={1}>
                            <StyledLinkList>
                              <StyledLink level={1}>
                                <Link href={href as string}>{translation}</Link>
                              </StyledLink>
                            <StyledLink level={1}>
                              <StyledLinkList>
                              {
                                offerLinks(id).map(({href, title}, index) => (
                                  <StyledLink key={index} level={2}>
                                    <Link href={href as string}>{title}</Link>
                                  </StyledLink>
                                ))
                              }
                              </StyledLinkList>
                            </StyledLink>
                            </StyledLinkList>
                          </StyledLink>
                      ))}
                    </StyledLinkList>
                  </StyledLink>
                  <StyledLink level={1}>
                    <StyledLinkList>
                      {index === 2 && locations && locations.map((location, index) => (
                        <StyledLink key={index} level={1}>
                          <Link href={location?.href as string}>{location.translation}</Link>
                        </StyledLink>
                      ))}
                    </StyledLinkList>
                  </StyledLink>
                  <StyledLink level={1}>
                    <StyledLinkList>
                      {index === 4 && organizerLinks.map((organizationLink, index) => (
                        <StyledLink key={index} level={1}>
                          <Link href={organizationLink?.href as string}>{organizationLink.title}</Link>
                        </StyledLink>
                      ))}
                    </StyledLinkList>
                  </StyledLink>

                </StyledLinkList>
              </StyledLink>
            ))}
          </StyledLinkList>
        </EntryFormContainer>
      </EntryFormWrapper>
    </>
  )
}