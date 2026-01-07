<template>
  <div class="app">
    <header class="header">
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/articles" class="nav-link">文章列表</router-link>
      </nav>
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer">
      <p>&copy; 2024 我的博客. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #42b983;
}

.main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.footer {
  background: #f5f5f5;
  text-align: center;
  padding: 2rem;
  margin-top: auto;
}
</style>
