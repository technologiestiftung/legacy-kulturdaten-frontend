import React, { useEffect, useMemo, useState } from 'react';
import { useApiCall } from '../../../../lib/api';
import { CategoryEntry } from '../../../../lib/api/types/general';
import { Link } from '../../../../lib/api/types/link';
import { useEntry } from '../../../../lib/categories';
import { useT } from '../../../../lib/i18n';
import { EntryFormHead } from '../../../EntryForm/EntryFormHead';
import { useLinkList } from '../../../linklist';
import { EntryFormHook } from '../form';
import { FormContainer, FormGrid, FormItem, FormItemWidth } from '../formComponents';

export const useLinksForm: EntryFormHook = ({ category, query }, loaded) => {
  const t = useT();
  const call = useApiCall();
  const { entry, mutate } = useEntry(category, query);

  const initialLinks = useMemo(
    () =>
      (
        entry?.data?.relations as { links: Link[] } & CategoryEntry['data']['relations']
      )?.links?.map((link) => link.attributes?.url),
    [entry?.data?.relations]
  );

  const [links, setLinks] = useState<string[]>(initialLinks);

  const [linksFromApi, setLinksFromApi] = useState<string[]>();

  const pristine = useMemo(
    () =>
      links === initialLinks ||
      (Array.isArray(links) &&
        Array.isArray(initialLinks) &&
        links.length === initialLinks.length &&
        links.reduce((allLinksEqual, link, index) => {
          if (link !== initialLinks[index]) {
            return false;
          }
          return allLinksEqual;
        }, true)),
    [links, initialLinks]
  );

  const { renderedLinkList, init, valid } = useLinkList({
    links: links || [],
    onChange: (updatedLinks) => {
      setLinks(updatedLinks);
    },
    maxLinks: 3,
    required: false,
  });

  useEffect(() => {
    if (initialLinks !== linksFromApi) {
      setLinksFromApi(initialLinks);
      setLinks(initialLinks);
      init(initialLinks);
    }
  }, [init, linksFromApi, initialLinks]);

  return {
    renderedForm: (
      <FormContainer>
        <EntryFormHead title={`${t('forms.links') as string}`} valid={!loaded || valid} />
        <FormGrid>
          <FormItem width={FormItemWidth.full}>{renderedLinkList}</FormItem>
        </FormGrid>
      </FormContainer>
    ),
    submit: async () => {
      if (valid && !pristine) {
        try {
          const resp = await call(category.api.update.factory, {
            id: entry.data.id,
            entry: {
              relations: {
                links,
              },
            },
          });

          if (resp.status === 200) {
            mutate();
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
    pristine,
    reset: () => {
      setLinksFromApi(initialLinks);
      setLinks(initialLinks);
      init(initialLinks);
    },
    valid: !loaded || valid,
    hint: false,
  };
};
