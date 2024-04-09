import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useInfiniteQuery } from 'react-query';

interface City {
  geoname_id: string;
  name: string;
  cou_name_en: string;
  timezone: string;
  alternate_names?: string[]; 
  ascii_name?: string; 
}

interface GeoData {
  total_count: number;
  results: City[];
}

const CityTable = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const observer = useRef<IntersectionObserver | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<GeoData>(
    ['cities', searchTerm], // Include searchTerm in the query key
    async ({ pageParam = 0, queryKey }) => {
      const [searchTerm] = queryKey;
      const response = await axios.get<GeoData>(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${pageParam * 20}&q=${searchTerm}`
      );
      return response.data;
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages.length * 20 < lastPage.total_count) {
          return pages.length;
        } else {
          return undefined;
        }
      },
    }
  );
  
  const lastCityRef = useCallback(
    (node: HTMLElement | null) => { 
      if (isFetchingNextPage) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const filteredCities = data?.pages.flatMap((page) =>
    page.results.filter((city) =>
      // city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       city.ascii_name?.toLowerCase().includes(searchTerm.toLowerCase())
      // || city.alternate_names?.some((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const handleSearch = () => {
    fetchNextPage({ pageParam: 0, search: searchTerm } as any);
  };
  

  return (
    <div className="container mx-auto px-4">
      <input
        type="text"
        placeholder="Search City"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {/* {status === 'loading' && <p>Loading...</p>} */}
      {filteredCities?.length === 0 && <p>No cities found</p>}
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timezone</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredCities?.map((city, index) => {
            if (filteredCities.length === index + 1) {
              return (
                <tr key={city.geoname_id} ref={lastCityRef}>
                  <td>{city.name}</td>
                  <td>{city.cou_name_en}</td>
                  <td>{city.timezone}</td>
                </tr>
              );
            } else {
              return (
                <tr key={city.geoname_id}>
                  <td>{city.name}</td>
                  <td>{city.cou_name_en}</td>
                  <td>{city.timezone}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
      {/* {isFetchingNextPage && <p>Loading more...</p>} */}
    </div>
  );
};

export default CityTable;
