---
featureImage: /images/img-background.svg
title: "Frequently asked questions"
layout: layouts/page.html
permalink: /faqs/

aside: |

  <p>The Shared Homeland Paradigm is a £1 million UKRI-ESRC research project developed with A Land for All (ALFA), a joint Palestinian-Israeli movement. The project reimagines space, rights, and partnerships in Palestine-Israel.</p>

---

{% for faq in collections.faqs %}
<details>
<summary>{{ faq.data.title }}</summary>
<div class="faq-answer">
{{ faq.templateContent | safe }}
</div>
</details>
{% endfor %}
