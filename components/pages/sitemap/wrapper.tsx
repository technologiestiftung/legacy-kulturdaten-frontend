
import { defaultLanguage } from "../../../config/locale";
import { useDate } from "../../../lib/date";
import { useT } from "../../../lib/i18n";
import { useLanguage, useLocale } from "../../../lib/routing";
import { getTranslation } from "../../../lib/translations";
import { useOrganizerId } from "../../../lib/useOrganizer";
import { Breakpoint, useBreakpointOrWider } from "../../../lib/WindowService";
import { EntryHeader } from "../../EntryHeader"
import { useUserOrganizerLists } from "../../user/useUser";

interface SitemapContainerProps {
  organizerId? :string;
}

export const SitemapContainer: React.FC<SitemapContainerProps> = ({}: SitemapContainerProps) => {
  const language = useLanguage();
  const t = useT();
  const organizerLists = useUserOrganizerLists();
  const organizerId = useOrganizerId();

  const organizer = organizerLists.all.filter(organizer => organizer.id === organizerId)[0] || undefined


  const locale = useLocale();
  const isUltraOrWider = useBreakpointOrWider(Breakpoint.ultra);

  const currentTranslation = organizer ? getTranslation(language, organizer.relations?.translations, true) : undefined
  const defaultTranslation = organizer ? getTranslation(defaultLanguage, organizer.relations?.translations, true) : undefined

  const subTitle = 
    currentTranslation?.attributes?.name ||
    defaultTranslation?.attributes?.name ||
    (t('general.placeholderOrganizer') as string)

  return (
    <EntryHeader 
      title="Sitemap"
      subTitle={subTitle}
      minimalVariant
      wideLayout
    />
  )
}