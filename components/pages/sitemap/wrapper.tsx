
import { defaultLanguage } from "../../../config/locale";
import Link from 'next/link';
import styled from '@emotion/styled';
import { useT } from "../../../lib/i18n";
import { routes, Routes, useLanguage, useLocale } from "../../../lib/routing"
import { getTranslation } from "../../../lib/translations";
import { useOrganizerId } from "../../../lib/useOrganizer";
import { EntryFormContainer, EntryFormWrapper } from "../../EntryForm/wrappers";
import { EntryHeader } from "../../EntryHeader"
import { useUserOrganizerLists } from "../../user/useUser";
import { useMemo } from "react";
import { useMenuStructure } from "../../../config/structure";
import { useCategories } from "../../../config/categories";
import { OfferList } from "../../../lib/api";
import { Location } from "../../../lib/api/types/location";
import { Offer, OfferTranslation } from "../../../lib/api/types/offer";
import { useList } from "../../../lib/categories";
import { defaultOrganizerId } from "../../navigation/NavigationContext";
import { LocationTranslation } from "../../../lib/api/types/location";
import { LocationList } from '../../../lib/api/routes/location/list'

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
                id,
                returnHref: href
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
                routes[Routes.location]({
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
                translation,
                id,
                returnHref: href
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

  const level_1_links = useMemo(() => {
    return NavigationStructure.header.loggedIn.menuItems.filter(item => item.type === 'link')
  }, [ NavigationStructure ])


  const dahboardLinks = () => { 
    const subs = ['quicklinks', 'help', 'openSource', 'contact']
    return subs.map(sub => {
      return {
        href: `${level_1_links[0].action.href}#${t(`dashboard.info.linkList.${sub}.id`)}`,
        title: t(`dashboard.info.linkList.${sub}.title`)
      }
    })
  }

  const offerLinks = (offerID) => { 
    const subs = ['info','categorization','dates','audience','media']
    return subs.map(sub => {
      const offer = offers?.filter(offer => offer.id === offerID)[0]
      return {
        href: offer ? offer?.returnHref(sub) : '',
        title: t(`categories.offer.tabs.${sub}`)
      }
    })
  }

  const locationLinks = (locationID) => {
    const subs = ['info','service','media','accessibility']
    const location = locations?.filter(location => location.id === locationID)[0]
    return subs.map(sub => {
      return {
        href: location ? location?.returnHref(sub) : '',
        title: t(`categories.location.tabs.${sub}`)
      }
    })
  }

  const organizerLinks = () => { 
    const subs = ['info', 'categorization', 'media']
    return subs.map(sub => {
      return {
        href: `${level_1_links[4].action.href.slice(0,-5)}${sub}`,
        title: t(`categories.organizer.tabs.${sub}`)
      }
    })
  }

  
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
                      {index === 0 && dahboardLinks().map((link, index) => (
                        <StyledLink key={index} level={1}>
                          <Link href={link.href as string}>{link.title}</Link>
                        </StyledLink>
                      ))}
                    </StyledLinkList>
                  </StyledLink>

                  <StyledLink level={0}>
                    <StyledLinkList>
                      {index === 1 && offers && offers.map(({href, translation, id}, index) => (
                        <StyledLink key={index} level={1}>
                          <StyledLinkList>
                            <StyledLink level={1}>
                              <Link href={href as string}>{translation}</Link>
                            </StyledLink>
                          <StyledLink level={0}>
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

                  <StyledLink level={0}>
                    <StyledLinkList>
                      {index === 2 && locations && locations.map(({href, translation, id}, index) => (
                        <StyledLink key={index} level={1}>
                          <StyledLinkList>
                            <StyledLink level={1}>
                              <Link href={href as string}>{translation}</Link>
                            </StyledLink>
                          <StyledLink level={0}>
                            <StyledLinkList>
                            {
                              locationLinks(id).map(({href, title}, index) => (
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
                      {index === 4 && organizerLinks().map((organizationLink, index) => (
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