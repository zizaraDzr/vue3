import type { ComputedRef } from 'vue';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { AppRouteNames } from 'src/router';
import { api } from 'src/services';
import type { Article } from 'src/services/api';
import useAsync from 'src/utils/use-async';

const routeNameToArticlesType: Partial<Record<AppRouteNames, ArticlesType>> = {
  'global-feed': 'global-feed',
  'my-feed': 'my-feed',
  tag: 'tag-feed',
  profile: 'user-feed',
  'profile-favorites': 'user-favorites-feed',
};

export function useArticles() {
  const { articlesType, tag, username, metaChanged } = useArticlesMeta();
  console.log('metaChange', metaChanged.value);

  const articles = ref<Article[]>([]);
  const articlesCount = null;
  const updateArticle = null;
  const page = null;
  const changePage = null;

  async function fetchArticles(): Promise<void> {
    articles.value = [];
    let responsePromise: null | Promise<{ articles: Article[] }> = null;

    switch (articlesType.value) {
      case 'my-feed':
        responsePromise = api.articles.getArticlesFeed().then((res) => res.data);
        break;
      case 'global-feed':
        responsePromise = api.articles.getArticles().then((res) => res.data);
        break;
      default:
        break;
    }

    if (responsePromise === null) {
      console.error(`Articles type "${articlesType.value}" not supported`);
      return;
    }

    const response = await responsePromise;
    articles.value = response.articles;
  }

  const { active: articlesDownloading, run: runWrappedFetchArticles } = useAsync(fetchArticles);
  return {
    fetchArticles: runWrappedFetchArticles,
    articlesDownloading,
    articlesCount,
    articles,
    updateArticle,
    page,
    changePage,
    tag,
    username,
  };
}

interface UseArticlesMetaReturn {
  tag: ComputedRef<string>;
  username: ComputedRef<string>;
  articlesType: ComputedRef<ArticlesType>;
  metaChanged: ComputedRef<string>;
}

export type ArticlesType =
  | 'global-feed'
  | 'my-feed'
  | 'tag-feed'
  | 'user-feed'
  | 'user-favorites-feed';

export const articlesTypes: ArticlesType[] = [
  'global-feed',
  'my-feed',
  'tag-feed',
  'user-favorites-feed',
  'user-feed',
];

export const isArticlesType = (type: unknown): type is ArticlesType =>
  articlesTypes.includes(type as ArticlesType);

export function useArticlesMeta(): UseArticlesMetaReturn {
  const route = useRoute();

  const tag = ref('');
  const username = ref('');
  const articlesType = ref<ArticlesType>('global-feed');

  watch(
    () => route.name,
    (routeName) => {
      const possibleArticlesType = routeNameToArticlesType[routeName as AppRouteNames];
      if (!isArticlesType(possibleArticlesType)) return;

      articlesType.value = possibleArticlesType;
    },
    { immediate: true }
  );

  return {
    tag: computed(() => tag.value),
    username: computed(() => username.value),
    articlesType: computed(() => articlesType.value),
    metaChanged: computed(() => `${articlesType.value}-${username.value}-${tag.value}`),
  };
}
