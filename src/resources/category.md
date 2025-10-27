---
pagination:
  data: collections.resourcesCategory
  size: 1
  alias: category
permalink: "/resources/category/{{ category | slug }}/"
layout: "layouts/base.html"
eleventyComputed:
  title: "Resources: {{ category }}"
---

{% block content %}
<div class="resources-layout">
  <aside class="sidebar">
    <h3>Categories</h3>
    <nav>
      {% for category in collections.resourcesCategory %}
        <a href="/resources/category/{{ category | slug }}/">{{ category }}</a>
      {% endfor %}
    </nav>

    <h3>Search</h3>
    <form id="search-form">
      <input type="search" id="search-input" placeholder="Search resources...">
      <button type="submit">Search</button>
    </form>
  </aside>

  <main class="resources-list">
    <h1>Search Resources</h1>
    <div id="search-results">
      <p>Enter a search term to find resources.</p>
    </div>
  </main>
</div>

<script>
// Client-side search JavaScript here
</script>
{% endblock %}