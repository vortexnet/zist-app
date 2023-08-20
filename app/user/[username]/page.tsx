'use client';

import { useMemo, useState } from 'react';

import PreviewCard from '@/components/preview/preview-card';
import Search from '@/components/search';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getAllCategories,
  getAllLanguages,
  getAllTags,
  getAllZistsData,
} from '@/lib/dataFilters';
import { useGetAllGistsOfUser } from '@/lib/hooks/useGists';
import { Gist } from '@/lib/types/gist';
import { Filters, SortOrder, Sorts } from '@/lib/types/zist';
import CategoryFilter from '@/components/filters/category-filter';
import LanguageFilter from '@/components/filters/language-filter';
import TagsFilter from '@/components/filters/tags-filter';
import SortDropdown from '@/components/sorts/sort';
import SortOrderDropdown from '@/components/sorts/sort-order';

const UserPage = ({ params }: { params: { username: string } }) => {
  const [filter, setFilter] = useState<Filters>();
  const [sort, setSort] = useState<Sorts>('updated');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data: gists, isLoading } = useGetAllGistsOfUser(params?.username);

  const data = useMemo(
    () => getAllZistsData(gists, filter as Filters, sort, sortOrder),
    [gists, filter, sort, sortOrder]
  );

  const categories = useMemo(() => getAllCategories(gists), [gists]);

  const allTags = useMemo(() => getAllTags(gists), [gists]);

  const languages = useMemo(() => getAllLanguages(gists), [gists]);

  const getGists = () => {
    return (
      data?.map((gist: Gist) => {
        return (
          <PreviewCard
            files={gist.files}
            key={gist.id}
            description={gist.description}
            categories={categories}
            gistId={gist.id}
            allTags={allTags}
            isPublic={true}
            updated_at={gist.updated_at}
          />
        );
      }) || []
    );
  };

  return (
    <div className="min-h-screen pr-10">
      <h1 className="text-4xl font-bold mt-2">Zists</h1>
      <section className="mt-10">
        <Search
          searchInput={filter?.search || ''}
          setSearchInput={(value) => setFilter({ ...filter, search: value })}
        />
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">Filters</h2>
        <div className="flex items-center gap-10 mt-5 flex-wrap">
          <CategoryFilter
            allCategories={categories}
            selectedCategory={filter?.category}
            setSelectedCategory={(value) =>
              setFilter({ ...filter, category: value })
            }
          />
          <LanguageFilter
            allLanguages={languages}
            selectedLanguage={filter?.language}
            setSelectedLanguage={(value) =>
              setFilter({ ...filter, language: value })
            }
          />
        </div>

        <div className={`mt-10 ${allTags.length === 0 ? 'hidden' : ''}`}>
          <h2 className="text-2xl font-bold mb-5">Tags</h2>
          <TagsFilter
            allTags={allTags}
            selectedTags={filter?.tags}
            setSelectedTags={(value) => setFilter({ ...filter, tags: value })}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">Sorts</h2>
        <div className="flex items-center gap-10 mt-5 flex-wrap">
          <SortDropdown
            selectedSort={sort}
            setSelectedSort={(value) => setSort(value)}
          />
          <SortOrderDropdown
            selectedSortOrder={sortOrder}
            setSelectedSortOrder={(value) => setSortOrder(value)}
          />
        </div>
      </section>

      <section className="flex items-center gap-10 mt-10 flex-wrap">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-full lg:w-[calc(50%-2.5rem)] h-96 rounded-2xl"
            />
          ))
        ) : getGists().length > 0 ? (
          getGists()
        ) : (
          <p>No gists found</p>
        )}
      </section>
    </div>
  );
};

export default UserPage;