---
layout: "layouts/base.html"
title: "Resources"
permalink: "/resources/"
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
    <form action="/resources/search/" method="GET">
      <input type="search" name="q" placeholder="Search resources...">
      <button type="submit">Search</button>
    </form>
  </aside>

  <main class="resources-list">
    {% for resource in collections.resources %}
      <article class="resource">
        <h2>
          {% if resource.data.url %}
            <a href="{{ resource.data.url }}">{{ resource.data.title }}</a>
          {% else %}
            <a href="{{ resource.data.file }}">{{ resource.data.title }}</a>
          {% endif %}
        </h2>
        <p class="meta">By {{ resource.data.author }} • {{ resource.data.date | dateFilter }}</p>
        <p class="summary">{{ resource.data.summary }}</p>
        <div class="taxonomy">
          {% for category in resource.data.categories %}
            <a href="/resources/category/{{ category | slug }}/" class="category">{{ category }}</a>
          {% endfor %}
          {% for tag in resource.data.tags %}
            <a href="/resources/tag/{{ tag | slug }}/" class="tag">{{ tag }}</a>
          {% endfor %}
        </div>
      </article>
    {% endfor %}
  </main>
</div>
{% endblock %}