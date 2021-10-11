import React, { useMemo, useState } from 'react';
import { ApiCall, useApiCall } from '../../../../lib/api';
import { Tag } from '../../../../lib/api/types/tag';
import { useEntry } from '../../../../lib/categories';
import { useT } from '../../../../lib/i18n';
import { useTags } from '../../../../lib/useTags';
import { EntryFormHead } from '../../../EntryForm/EntryFormHead';
import { Tags } from '../../../tags';
import { FormGrid, FormItem, FormItemWidth } from '../formComponents';
import { EntryFormHook } from '../form';
import { CategoryEntry } from '../../../../lib/api/types/general';

export const useEntryTags: EntryFormHook = ({ category, query }) => {
  const tagOptions = useTags();
  const { entry, mutate } = useEntry<CategoryEntry, ApiCall>(category, query);
  const call = useApiCall();
  const [selectedTags, setSelectedTags] = useState<Tag['id'][]>();
  const t = useT();

  const initialTags = useMemo(
    () => entry?.data?.relations?.tags?.map((tag) => tag.id),
    [entry?.data?.relations?.tags]
  );

  const pristine = useMemo(() => {
    if (selectedTags?.length !== initialTags?.length) {
      return false;
    }

    if (selectedTags && initialTags) {
      for (let i = 0; i < selectedTags.length; i += 1) {
        if (selectedTags[i] !== initialTags[i]) {
          return false;
        }
      }
    }

    return true;
  }, [initialTags, selectedTags]);

  return {
    renderedForm: (
      <div>
        <EntryFormHead title={t('general.topics') as string} />
        <FormGrid>
          <FormItem width={FormItemWidth.full}>
            {tagOptions && (
              <Tags
                options={tagOptions}
                value={selectedTags || initialTags}
                onChange={(newValue) => setSelectedTags(newValue)}
              />
            )}
          </FormItem>
        </FormGrid>
      </div>
    ),
    pristine,
    valid: true,
    hint: false,
    reset: () => undefined,
    submit: async () => {
      try {
        const resp = await call<ApiCall>(category.api.update.factory, {
          id: entry.data.id,
          entry: {
            relations: {
              tags: selectedTags,
            },
          },
        });

        if (resp.status === 200) {
          mutate();
        }
      } catch (e) {
        console.error(e);
      }
    },
  };
};
