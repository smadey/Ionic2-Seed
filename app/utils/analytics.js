export function init (channel, id, platform) {
  switch (channel && channel.toLowerCase()) {
    case 'talkingdata':
      initTalkingData(id, platform);
      break;
    case 'google':
      initGoogleAnalytics(id);
      break;
  }
}

export function initGoogleAnalytics (id) {
  if (window.analytics) {
    window.analytics.startTrackerWithId(id);
  }
}

export function initTalkingData (id, platform) {
  if (window.TalkingData) {
    window.TalkingData.init(id, platform);
  }
}

export function view (title, url) {
  if (window.analytics) {
      window.analytics.trackView(url);
  }

  if (window.TalkingData) {
      window.TalkingData.onPage(url);
  }
}

export function trigger (category, action, label, value) {
  if (window.analytics) {
      window.analytics.trackEvent(category, action, label, value);
  }

  if (window.TalkingData) {
      window.TalkingData.onEventWithLabel(action, label);
  }
}
