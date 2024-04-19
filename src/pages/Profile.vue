<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            {{ showEdit }}
            <div v-if="!profile" class="align-left">Profile is downloading...</div>
            <template v-else>
              <img :src="profile.image" class="user-img" :alt="profile.username" />

              <h4>{{ profile.username }}</h4>

              <p v-if="profile.bio">
                {{ profile.bio }}
              </p>

              <AppLink
                v-if="showEdit"
                class="btn btn-sm btn-outline-secondary action-btn"
                name="settings"
                aria-label="Edit profile settings"
              >
                <i class="ion-gear-a space" />
                Edit profile settings
              </AppLink>
              {{ followProcessGoing }}
              {{ toggleFollow }}
              <button
                v-if="showFollow"
                class="btn btn-sm btn-outline-secondary action-btn"
                :disabled="followProcessGoing"
                @click="toggleFollow"
              >
                <i class="ion-plus-round space" />
                {{ profile.following ? 'Unfollow' : 'Follow' }} {{ profile.username }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <Suspense>
            <ArticlesList use-user-feed use-user-favorited />
            <template #fallback> Articles are downloading... </template>
          </Suspense>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import ArticlesList from 'src/components/ArticlesList.vue';
import { useFollow } from 'src/composable/useFollowProfile';
import { useProfile } from 'src/composable/useProfile';
import type { Profile } from 'src/services/api';
import { useUserStore } from 'src/store/user';
console.log(1);

const route = useRoute();
console.log(2);

const username = computed<string>(() => route.params.username as string);
console.log(3);

console.log({ username });

const { profile, updateProfile } = useProfile({ username });
console.log(4, useFollow);

const { followProcessGoing, toggleFollow } = useFollow({
  following: computed<boolean>(() => profile.value?.following ?? false),
  username,
  onUpdate: (newProfileData: Profile) => updateProfile(newProfileData),
});
console.log(5);

const { user, isAuthorized } = storeToRefs(useUserStore());
console.log(6);

const showEdit = computed<boolean>(() => isAuthorized && user.value?.username === username.value);
console.log(7);

const showFollow = computed<boolean>(() => user.value?.username !== username.value);
</script>

<style scoped>
.space {
  margin-right: 4px;
}
.align-left {
  text-align: left;
}
</style>
