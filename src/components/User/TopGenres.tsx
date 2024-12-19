import { useApi } from '@/hooks';
import type { UserPublic, TopGenre } from '@/utils/statsfm';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, type FC, useState } from 'react';
import { event } from 'nextjs-google-analytics';
import { ChipGroup, Chip } from '../Chip';
import Scope from '../PrivacyScope';
import type { TimeframeSelection } from './utils';
import { getTimeframeOptions } from './utils';
import { NotEnoughData } from './NotEnoughData';

export const TopGenres: FC<{
  timeframe: TimeframeSelection;
  userProfile: UserPublic;
  topGenresRef: React.RefObject<HTMLElement>;
}> = ({ userProfile, timeframe }) => {
  const api = useApi();
  const [topGenres, setTopGenres] = useState<TopGenre[]>([]);
  const [loading, setLoading] = useState(true);

  const userProfileId = encodeURIComponent(userProfile.id);

  useEffect(() => {
    setTopGenres([]);

    api.users
      .topGenres(userProfileId, getTimeframeOptions(timeframe))
      .then(setTopGenres)
      .catch(() => [])
      .finally(() => setLoading(false));
  }, [timeframe, userProfileId]);

  return (
    <>
      <Scope value="topGenres">
        <ChipGroup
          className={clsx(topGenres.length === 0 && '!overflow-x-hidden')}
        >
          <NotEnoughData data={topGenres} loading={loading}>
            {topGenres?.length > 0
              ? topGenres.map((genre, i) => (
                  <Chip key={i}>
                    <Link
                      legacyBehavior
                      href={`/genre/${encodeURIComponent(genre.genre.tag)}`}
                    >
                      <a onClick={() => event('USER_top_genre_click')}>
                        {genre.genre.tag}
                      </a>
                    </Link>
                  </Chip>
                ))
              : Array(8)
                  .fill(null)
                  .map((_v, i) => (
                    <Chip
                      className="shrink-0 animate-pulse !text-transparent"
                      key={i}
                    >
                      {i.toString().repeat(i + (10 % 17))}
                    </Chip>
                  ))}
          </NotEnoughData>
        </ChipGroup>
      </Scope>
    </>
  );
};
