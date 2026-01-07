<script setup lang="ts">
const { showSearch, searchQuery, searchInputRef, toggleSearch, handleSearch } = useSearch()
</script>

<template>
  <div class="home">
    <button class="home__search-btn" @click="toggleSearch" aria-label="搜索">
      <IconSearch />
    </button>

    <div v-if="showSearch" class="home__search-overlay" @click.self="toggleSearch">
      <div class="home__search-box">
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          class="home__search-input"
          type="text"
          placeholder="搜索文章..."
          @keyup.enter="handleSearch"
        />
        <button class="home__search-submit" @click="handleSearch">搜索</button>
      </div>
    </div>

    <div class="home__content">
      <h1 class="home__title">耶温博客</h1>
      <p class="home__subtitle">记录思考，分享知识</p>
      <NuxtLink to="/articles" class="home__cta">查看文章</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: #fafafa;
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  padding: 24px;
}

.home__search-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home__search-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1f2937;
}

.home__search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.home__search-box {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 12px;
  min-width: 400px;
}

.home__search-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.home__search-input:focus {
  border-color: #3b82f6;
}

.home__search-submit {
  padding: 12px 24px;
  background: #1f2937;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.home__search-submit:hover {
  background: #111827;
}

.home__content {
  text-align: center;
  max-width: 600px;
}

.home__title {
  font-size: 64px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.home__subtitle {
  font-size: 20px;
  color: #6b7280;
  margin: 0 0 32px;
  font-weight: 400;
  line-height: 1.5;
}

.home__cta {
  display: inline-block;
  padding: 14px 32px;
  background: #1f2937;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 2px solid #1f2937;
}

.home__cta:hover {
  background: #111827;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .home__title {
    font-size: 48px;
  }

  .home__subtitle {
    font-size: 18px;
  }

  .home__search-box {
    min-width: auto;
    width: 90%;
    max-width: 400px;
  }
}
</style>

