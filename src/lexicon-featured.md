---
layout: 'layouts/base.html'
title: 'Featured terms'
description: 'A collection of specially featured web design and development terms'
---

<p class="intro">A curated selection of featured terms.</p>

<ul id="letter-list">
<li><a href="#" class="letter-link active" data-letter="all">All</a></li>
{% set featuredByLetter = collections.lexicon | filterByFeatured | groupByInitial %}
{% for letter, terms in featuredByLetter %}
<li><a href="#letter-{{ letter }}" class="letter-link" data-letter="{{ letter }}">{{ letter }}</a></li>
{% endfor %}
</ul>


{% set featuredByLetter = collections.lexicon | filterByFeatured | groupByInitial %}
{% for letter, terms in featuredByLetter %}

<section class="letter-section" id="letter-{{ letter }}" data-letter="{{ letter }}">

{% for term in terms %}

<article class="item-lexicon">
<h3><a href="{{ term.url }}">{{ term.data.title }}</a></h3>

<blockquote>
<p>{{ term.data.summary }}</p>
</blockquote>

{% if term.data.url %}
<p data-size="s"><a href="{{ term.data.url }}">External reference</a></p>
{% endif %}
</article>
{% endfor %}
</section>
{% endfor %}

<script>
// Include the exact same JavaScript from your main lexicon page
document.addEventListener('DOMContentLoaded', function() {
const letterLinks = document.querySelectorAll('.letter-link');
const letterSections = document.querySelectorAll('.letter-section');

function showAllLetters() {
letterSections.forEach(section => {
section.classList.remove('filtered');
section.classList.remove('active');
});

letterLinks.forEach(link => {
link.classList.remove('active');
});
document.querySelector('.letter-link[data-letter="all"]').classList.add('active');

history.replaceState(null, null, window.location.pathname);
}

function showLetter(letter) {
letterSections.forEach(section => {
section.classList.add('filtered');
section.classList.remove('active');
});

letterLinks.forEach(link => {
link.classList.remove('active');
});

const targetSection = document.getElementById(`letter-${letter}`);
const targetLink = document.querySelector(`.letter-link[data-letter="${letter}"]`);

if (targetSection && targetLink) {
targetSection.classList.add('active');
targetLink.classList.add('active');
}

history.replaceState(null, null, `#letter-${letter}`);
}

const initialHash = window.location.hash;
if (initialHash && initialHash.startsWith('#letter-')) {
const initialLetter = initialHash.replace('#letter-', '');
showLetter(initialLetter);
} else {
showAllLetters();
}

letterLinks.forEach(link => {
link.addEventListener('click', function(e) {
e.preventDefault();
const letter = this.getAttribute('data-letter');

if (letter === 'all') {
showAllLetters();
} else {
showLetter(letter);
}
});
});
});
</script>