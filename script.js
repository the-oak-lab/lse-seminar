document.addEventListener("DOMContentLoaded", () => {
  fetch('schedule.json')
    .then(response => response.json())
    .then(data => buildScheduleTable(data))
    .catch(err => console.error(err));
});

function buildScheduleTable(data) {
  const table = document.getElementById("schedule-table");
  const tbody = table.querySelector('tbody');

  const colLabels = ["Date", "Speakers", "Topic"];

  data.forEach(entry => {
    const tr = document.createElement('tr');

    // Date Cell
    const dateTd = document.createElement('td');
    dateTd.setAttribute('data-label', colLabels[0]);
    dateTd.textContent = entry.date || 'TBA';
    tr.appendChild(dateTd);

    // Speakers Cell
    // Speakers Cell
    const speakerTd = document.createElement('td');
    speakerTd.setAttribute('data-label', colLabels[1]);

    // helper: turn "Name (Role @ Org)" into two lines
    function formatSpeaker(sp) {
      const raw = (sp.name || '').trim();
      const m = raw.match(/^(.+?)\s*\((.+)\)\s*$/);   // Name (Role …)
      const name = m ? m[1] : raw;
      const role = m ? m[2] : '';

      const inner = `
        <span class="speaker-name">${name}</span>
        ${role ? `<span class="speaker-role">${role}</span>` : ''}
      `;

      if (sp.link && sp.link.trim() !== '') {
        return `
          <a class="speaker-link" href="${sp.link}" target="_blank" rel="noopener noreferrer">
            ${inner}
          </a>`;
      }
      return `<span class="speaker-link">${inner}</span>`;
    }

    let speakerContent = '';
    if (Array.isArray(entry.speakers) && entry.speakers.length > 0) {
      speakerContent = `
        <div class="speaker-list">
          ${entry.speakers.map(sp => `<div class="speaker-item">${formatSpeaker(sp)}</div>`).join('')}
        </div>`;
    } else if (entry.speaker && entry.speaker.trim() !== '') {
      // backwards-compat single speaker string
      const sp = { name: entry.speaker, link: '' };
      speakerContent = `<div class="speaker-list"><div class="speaker-item">${formatSpeaker(sp)}</div></div>`;
    } else {
      speakerContent = '<span class="tba">TBA</span>';
    }

    speakerTd.innerHTML = speakerContent;
    tr.appendChild(speakerTd);


    // Topic Cell
    const topicTd = document.createElement('td');
    topicTd.setAttribute('data-label', colLabels[2]);

    let topicText = (entry.topic && entry.topic.trim() !== '') ? entry.topic : 'TBA';

    if (entry.topicSlides && entry.topicSlides.trim() !== '') {
      topicText = `<a href="${entry.topicSlides}" target="_blank" rel="noopener noreferrer">${topicText}</a>`;
    }

    topicTd.innerHTML = topicText;
    tr.appendChild(topicTd);

    tbody.appendChild(tr);
  });
}
