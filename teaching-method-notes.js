/* Delight & Savor · teaching method additions
   Adds mode-specific literature rhythms and the Honors principle to the
   Philosophy and Teacher's Notebook pages without replacing existing copy. */
(function(){
  'use strict';
  function qs(s,r){return (r||document).querySelector(s)}
  function mount(section, before){
    var footer=qs('footer');
    if(before&&before.parentNode)before.parentNode.insertBefore(section,before);
    else if(footer&&footer.parentNode)footer.parentNode.insertBefore(section,footer);
    else document.body.appendChild(section);
  }

  function philosophy(){
    if(!/philosophy(?:\.html)?$/.test(location.pathname)||qs('#ds-literature-rhythms'))return;
    var sec=document.createElement('section');
    sec.id='ds-literature-rhythms';sec.className='ds-method-section';
    sec.innerHTML='<div class="ds-method-inner"><p class="ds-method-kicker">One habit · different forms</p><h2>Attention changes shape with the literature.</h2><p class="ds-method-lead">We begin by attending, deepen by questioning, and keep what matters. But a poem, a novel, and a play should not be encountered in exactly the same way.</p><div class="ds-rhythm-grid"><article><h3>Poetry</h3><p class="ds-rhythm-line">Hear → Notice → Narrate → Look Again → Discuss → Keep</p><p>We hear the poem before we explain it. Narration begins with what stayed — an image, sound, feeling, question, or idea — and analysis comes only after the poem has been received.</p></article><article><h3>Novel · Prose</h3><p class="ds-rhythm-line">Read → Narrate → Find → Follow → Frame → Keep</p><p>Students first hold the reading in their own minds through narration, then return to the text to observe closely, trace patterns, make meaning, and keep what matters.</p></article><article><h3>Drama · Shakespeare</h3><p class="ds-rhythm-line">Remember the World → Enter Shakespeare’s World → Read Aloud → Narrate the Scene → Find · Follow · Frame → Keep</p><p>We read the entire play aloud together in class. Before each week’s reading, students re-enter the characters, settings, and plot-so-far; a student group opens one doorway into Shakespeare’s world. Then the play itself gets the room.</p></article></div><div class="ds-honors-note"><h3>Honors means depth, not volume.</h3><p>Honors students do not carry a second curriculum beside the first. Their enrichment grows from the literature already in front of them — a metaphor traced farther, another text placed in conversation, a staging compared, a counter-reading tested, a question pursued more deeply. Research tools appear when the literature genuinely calls for them.</p></div></div>';
    mount(sec,qs('.phil-cta'));
  }

  function teachers(){
    if(!/teachers-notebook(?:\.html)?$/.test(location.pathname)||qs('#ds-teaching-rhythms'))return;
    var sec=document.createElement('section');
    sec.id='ds-teaching-rhythms';sec.className='ds-method-section ds-method-teacher';
    sec.innerHTML='<div class="ds-method-inner"><p class="ds-method-kicker">Teaching overview</p><h2>Three literary forms, three classroom rhythms.</h2><p class="ds-method-lead">The method stays coherent without becoming mechanical: receive the work, let students narrate what they have encountered, then deepen through Find It · Follow It · Frame It and Keep what matters.</p><div class="ds-rhythm-grid"><article><h3>Poetry</h3><p class="ds-rhythm-line">Hear → Notice → Narrate → Look Again → Discuss → Keep</p><p><strong>First hearing:</strong> no pencils; listen for what catches attention. Give the poem a brief silence. Ask, “What stayed with you?” Hear it again with one invitation: “Listen for something you did not notice the first time.” Only then move into close reading and literary discussion.</p></article><article><h3>Novel · Prose</h3><p class="ds-rhythm-line">Read → Narrate → Find → Follow → Frame → Keep</p><p>Students narrate the reading before the teacher explains it. Once the story is held, Find names what is actually on the page, Follow traces pattern and change, Frame asks what it means, and Keep carries one thing forward.</p></article><article><h3>Drama · Shakespeare</h3><p class="ds-rhythm-line">Remember the World → Enter Shakespeare’s World → Read Aloud → Narrate the Scene → Find · Follow · Frame → Keep</p><p><strong>Remember the World:</strong> begin with a student presentation reviewing the main characters, main settings, and only the plot already read. <strong>Enter Shakespeare’s World:</strong> another group presents a topic that illuminates Shakespeare’s theatre, language, writing, historical world, sources, performance, or imagination. <strong>Read Aloud:</strong> assign parts and read the week’s portion of the play together in class. The whole play is encountered this way. Then narrate what happened and what changed before turning to the language itself.</p></article></div><div class="ds-teacher-callout"><h3>Why read Shakespeare this way?</h3><p>Drama is written for voices in a room. The character-and-plot review gives students enough footing to enter the next scene without pre-interpreting it for them; the world presentation adds context without taking the play away. Reading aloud lets humor, conflict, rhythm, interruption, and character arrive as drama rather than as a difficult page to decode alone.</p></div><div class="ds-honors-note"><h3>Honors · Go further into what is already here.</h3><p>Honors enrichment should belong unmistakably to the week: trace the controlling metaphor, compare two performances, test a critical lens against the text, find the counter-reading, or place two works in genuine conversation. Sometimes the seminar, composition, or capstone is already the deeper work; on those weeks, do not add an extra pile.</p></div><div class="ds-final-question"><p class="ds-method-kicker">The question at the end</p><h3>What do you notice now that you would have missed before?</h3><p>That is the measure of the course: not merely what a student can identify, but what a year of attention has taught the student to see.</p></div></div>';
    mount(sec,null);
  }

  function start(){philosophy();teachers()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
