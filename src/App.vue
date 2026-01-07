<template>
  <div class="app">
    <header class="header">
      <div class="header-container">
        <router-link to="/" class="logo">耶温博客</router-link>
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/articles" class="nav-link">文章</router-link>
        </nav>
      </div>
    </header>
    <main class="main">
      <router-view />
    </main>
    <footer class="footer">
      <p>&copy; 2026 耶温博客</p>
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
  background: #fafafa;
}

.header {
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  text-decoration: none;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #666;
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
  padding: 0;
}

.footer {
  background: #fff;
  border-top: 1px solid #e8e8e8;
  text-align: center;
  padding: 2rem;
  margin-top: auto;
  color: #999;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
