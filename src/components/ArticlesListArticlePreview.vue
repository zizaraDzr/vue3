<template>
  <div class="article-preview">
    <div class="article-meta">
      <AppLink name="profile" :params="{ username: props.article.author.username }">
        <img :src="article.author.image" :alt="props.article.author.username" />
      </AppLink>
      <div class="info">
        <AppLink
          name="profile"
          :params="{ username: props.article.author.username }"
          class="author"
        >
          {{ article.author.username }}
        </AppLink>
        <span class="date">{{ new Date(article.createdAt).toDateString() }}</span>
      </div>

      <button
        :aria-label="article.favorited ? 'Unfavorite article' : 'Favorite article'"
        class="btn btn-sm pull-xs-right"
        :class="[article.favorited ? 'btn-primary' : 'btn-outline-primary']"
      >
        <i class="ion-heart" /> {{ article.favoritesCount }}
      </button>
    </div>

    <AppLink name="article" :params="{ slug: props.article.slug }" class="preview-link">
      <h1>{{ article.title }}</h1>
      <p>{{ article.description }}</p>
      <span>Read more...</span>
      <ul class="tag-list">
        <li v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill tag-outline">
          {{ tag }}
        </li>
      </ul>
    </AppLink>
  </div>
</template>

<script setup lang="ts">
import type { Article } from 'src/services/api';
interface Props {
  article: Article;
}
const props = defineProps<Props>();
</script>
