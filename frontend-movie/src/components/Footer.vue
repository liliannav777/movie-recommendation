<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; 2025 Movie App. Tous droits réservés.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>

<style scoped>
.footer {
  background-color: #121212;
  color: #fff;
  padding: 2rem 0;
  text-align: center;
  font-size: 1rem;
}

.footer-content {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.footer-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--accent-color);
}
</style>
