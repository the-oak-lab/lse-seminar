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
    const speakerTd = document.createElement('td');
    speakerTd.setAttribute('data-label', colLabels[1]);

    let speakerContent = '';
    if (Array.isArray(entry.speakers) && entry.speakers.length > 0) {
      const speakerNames = entry.speakers.map(sp => {
        return (sp.link && sp.link.trim() !== '')
          ? `<a href="${sp.link}" target="_blank" rel="noopener noreferrer">${sp.name}</a>`
          : sp.name;
      });
      speakerContent = speakerNames.join('; ');
    } else if (entry.speaker && entry.speaker.trim() !== '') {
      speakerContent = entry.speaker;
    } else {
      speakerContent = 'TBA';
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
