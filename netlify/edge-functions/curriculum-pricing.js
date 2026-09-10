export default async function handler(request, context) {
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  try {
    let html = await response.text();
    if (html.includes('id="ways-to-learn"')) return response;

    const styles = `
<style id="ways-to-learn-styles">
  #ways-to-learn{padding:70px 0;background:var(--cream-warm);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
  #ways-to-learn .wtl-wrap{max-width:960px;margin:0 auto;padding:0 22px}
  #ways-to-learn .wtl-head{text-align:center;max-width:680px;margin:0 auto 34px}
  #ways-to-learn .wtl-head h2{font-family:"Playfair Display",serif;font-size:clamp(30px,4vw,42px);font-weight:600;line-height:1.08;color:var(--slate);margin:.28em 0 .28em}
  #ways-to-learn .wtl-head p{font-size:20px;color:var(--umber);margin:0}
  #ways-to-learn .wtl-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}
  #ways-to-learn .wtl-card{background:var(--cream);border:1px solid var(--line);border-radius:14px;padding:24px;box-shadow:var(--shadow-sm)}
  #ways-to-learn .wtl-card h3{font-family:"Playfair Display",serif;font-size:24px;font-weight:600;color:var(--slate);margin:0 0 5px}
  #ways-to-learn .wtl-price{font-family:"Lato",system-ui,sans-serif;font-size:15px;font-weight:700;color:var(--tawny);letter-spacing:.02em;margin-bottom:10px}
  #ways-to-learn .wtl-note{font-size:17px;color:var(--ink);line-height:1.5;margin:0}
  #ways-to-learn .wtl-full{grid-column:1/-1;background:var(--ds-paper-deep)}
  #ways-to-learn .wtl-full .wtl-price{font-size:17px}
  #ways-to-learn .wtl-cta{text-align:center;margin-top:30px}
  #ways-to-learn .wtl-fine{text-align:center;font-size:15px;font-style:italic;color:var(--umber);margin:14px auto 0;max-width:620px}
  @media(max-width:720px){#ways-to-learn .wtl-grid{grid-template-columns:1fr}#ways-to-learn .wtl-full{grid-column:auto}}
</style>`;

    const section = `
<section id="ways-to-learn" aria-labelledby="ways-title">
  <div class="wtl-wrap">
    <div class="wtl-head">
      <div class="eyebrow">Ways to Learn</div>
      <h2 id="ways-title">Choose the course. Choose the level of support.</h2>
      <p>The curriculum stays rich and complete at every level. What changes is how much individual teaching and feedback comes with it.</p>
    </div>

    <div class="wtl-grid">
      <div class="wtl-card">
        <h3>Middle School · Self-Paced</h3>
        <div class="wtl-price">$225 / school year · $25/month equivalent</div>
        <p class="wtl-note">Complete course access, weekly lessons, printables, projects, and resources. Parent-led, with no routine teacher grading.</p>
      </div>

      <div class="wtl-card">
        <h3>Middle School · Guided</h3>
        <div class="wtl-price">$30/month · $270 school year</div>
        <p class="wtl-note">Everything in Self-Paced, plus one individual Writer&rsquo;s Table conference each term. No routine grading.</p>
      </div>

      <div class="wtl-card">
        <h3>High School · Self-Paced</h3>
        <div class="wtl-price">$299 / school year · about $33/month equivalent</div>
        <p class="wtl-note">A complete Art of Attention or Art of Tragedy course with weekly lessons, handouts, projects, writing, and capstone materials.</p>
      </div>

      <div class="wtl-card">
        <h3>High School · Teacher-Supported Online</h3>
        <div class="wtl-price">$75/month · $675 school year</div>
        <p class="wtl-note">The full course plus ongoing review, grading, and individualized feedback.</p>
      </div>

      <div class="wtl-card">
        <h3>Live Online · Learn With Me</h3>
        <div class="wtl-price">$100/month · $900 school year</div>
        <p class="wtl-note">Weekly live teaching and discussion, with the full course experience and teacher support.</p>
      </div>

      <div class="wtl-card wtl-full">
        <h3>Year-Round Membership</h3>
        <div class="wtl-price">$39/month · $399/year</div>
        <p class="wtl-note">Year-round access to the complete In the Margin library: current courses, past courses, resources, and new self-paced content as it is added. Live teaching and individual teacher support are separate.</p>
      </div>
    </div>

    <div class="wtl-cta"><a class="btn btn--primary" href="Shop.html">Explore courses &amp; enrollment</a></div>
    <p class="wtl-fine">Course access is delivered through In the Margin, the Delight &amp; Savor literature and language library.</p>
  </div>
</section>`;

    html = html.replace('</head>', styles + '\n</head>');

    const anchors = [
      '<section class="catalog"',
      '<section class="featured"',
      '<footer'
    ];
    let inserted = false;
    for (const anchor of anchors) {
      const i = html.indexOf(anchor);
      if (i !== -1) {
        html = html.slice(0, i) + section + '\n' + html.slice(i);
        inserted = true;
        break;
      }
    }
    if (!inserted) html = html.replace('</body>', section + '\n</body>');

    const headers = new Headers(response.headers);
    headers.delete('content-length');
    return new Response(html, { status: response.status, statusText: response.statusText, headers });
  } catch (err) {
    return response;
  }
}
