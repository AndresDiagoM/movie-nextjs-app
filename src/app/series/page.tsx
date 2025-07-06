import { MovieHero } from "app/components/shared/ShowHero";
import { ShowsContainer } from "app/components/shared/ShowsContainer";
import ShowsService from "app/services/showService";
import { MediaType } from "app/types";
import { getRandomMovieFromList } from "app/utils";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "TV Series",
};

const Series: React.FC = async () => {
  // const latestSeries = await ShowsService.fetchTvShowsList("on_the_air");
  // const popularSeries = await ShowsService.fetchTvShowsList("popular");

  const actionSeries = await ShowsService.fetchDiscoverShows(MediaType.TV, {
    with_origin_country: "US",
    with_genres: 10759,
  });

  const comedySeries = await ShowsService.fetchDiscoverShows(MediaType.TV, {
    with_origin_country: "US",
    with_genres: 35,
  });

  const UsMxCoSeries = await ShowsService.fetchDiscoverShows(MediaType.TV, {
    with_origin_country: "US|MX|CO",
  });

  const CoSeries = await ShowsService.fetchDiscoverShows(MediaType.TV, {
    with_origin_country: "CO",
  });

  const randomShow = getRandomMovieFromList(actionSeries.results);

  return (
    <div className="pt-0 min-h-screen flex flex-col">
      <MovieHero randomShow={randomShow} mediaType={MediaType.TV} />

      <div className="relative pt-0 z-20 p-8 text-white text-center flex-1 space-y-8">
        <ShowsContainer
          shows={UsMxCoSeries.results}
          title="Popular Series"
          mediaType={MediaType.TV}
        />

        <ShowsContainer
          shows={CoSeries.results}
          title="Popular in Colombia"
          mediaType={MediaType.TV}
        />
        <ShowsContainer
          shows={actionSeries.results}
          title="Action Series"
          mediaType={MediaType.TV}
        />
        <ShowsContainer
          shows={comedySeries.results}
          title="Comedy Series"
          mediaType={MediaType.TV}
        />
      </div>
    </div>
  );
};

export default Series;
