(function initializeAllerXDetector(globalScope) {
  const builtInTriggers = [
    {
      id: "dimethicone",
      label: "Dimethicone",
      priority: "high",
      group: "Dimethicone family",
      source: "silicone",
      pattern: /\bdimethicone\b/gi,
    },
    {
      id: "amodimethicone",
      label: "Amodimethicone",
      priority: "high",
      group: "Dimethicone family",
      source: "silicone",
      pattern: /\bamodimethicone\b/gi,
    },
    {
      id: "peg-dimethicone",
      label: "PEG/PPG dimethicone",
      priority: "high",
      group: "Dimethicone family",
      source: "silicone",
      pattern: /\b(?:bis-peg|peg|ppg)[^,;()]*dimethicone\b/gi,
    },
    {
      id: "dimethiconol",
      label: "Dimethiconol",
      priority: "watch",
      group: "Silicone watchlist",
      source: "silicone",
      pattern: /\bdimethiconol\b/gi,
    },
    {
      id: "cyclopentasiloxane",
      label: "Cyclopentasiloxane",
      priority: "watch",
      group: "Silicone watchlist",
      source: "silicone",
      pattern: /\bcyclopentasiloxane\b/gi,
    },
    {
      id: "cyclohexasiloxane",
      label: "Cyclohexasiloxane",
      priority: "watch",
      group: "Silicone watchlist",
      source: "silicone",
      pattern: /\bcyclohexasiloxane\b/gi,
    },
    {
      id: "cyclomethicone",
      label: "Cyclomethicone",
      priority: "watch",
      group: "Silicone watchlist",
      source: "silicone",
      pattern: /\bcyclomethicone\b/gi,
    },
    {
      id: "phenyl-trimethicone",
      label: "Phenyl trimethicone",
      priority: "watch",
      group: "Silicone watchlist",
      source: "silicone",
      pattern: /\bphenyl\s+trimethicone\b/gi,
    },
    {
      id: "trimethylsiloxysilicate",
      label: "Trimethylsiloxysilicate",
      priority: "watch",
      group: "Silicone watchlist",
      source: "silicone",
      pattern: /\btrimethylsiloxysilicate\b/gi,
    },
    {
      id: "silicone-quaternium",
      label: "Silicone quaternium",
      priority: "watch",
      group: "Silicone watchlist",
      source: "silicone",
      pattern: /\bsilicone\s+quaternium-?\d*\b/gi,
    },
    {
      id: "polysilicone",
      label: "Polysilicone",
      priority: "watch",
      group: "Silicone watchlist",
      source: "silicone",
      pattern: /\bpoly\s?silicone-?\d*\b/gi,
    },
    {
      id: "silsesquioxane",
      label: "Silsesquioxane",
      priority: "watch",
      group: "Silicone watchlist",
      source: "silicone",
      pattern: /\b[a-z0-9-]*silsesquioxane\b/gi,
    },
    {
      id: "siloxane",
      label: "Siloxane",
      priority: "watch",
      group: "Silicone watchlist",
      source: "silicone",
      pattern: /\b[a-z0-9-]*siloxane\b/gi,
    },
    {
      id: "methicone",
      label: "Methicone",
      priority: "watch",
      group: "Silicone watchlist",
      source: "silicone",
      pattern: /\b[a-z0-9-]*methicone\b/gi,
    },
    {
      id: "silane",
      label: "Silane",
      priority: "watch",
      group: "Silicone watchlist",
      source: "silicone",
      pattern: /\b[a-z0-9-]*silane\b/gi,
    },
  ];

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function customTriggerToRule(term) {
    return {
      id: `custom-${term.toLowerCase()}`,
      label: term,
      priority: "watch",
      group: "Custom trigger",
      source: "custom",
      pattern: new RegExp(`\\b${escapeRegExp(term)}\\b`, "gi"),
    };
  }

  function findMatches(text, customTerms = []) {
    const rawMatches = [];
    const allTriggers = [
      ...builtInTriggers,
      ...customTerms.map(customTriggerToRule),
    ];

    allTriggers.forEach((rule) => {
      const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
      let match;

      while ((match = pattern.exec(text)) !== null) {
        rawMatches.push({
          id: rule.id,
          label: rule.label,
          group: rule.group,
          priority: rule.priority,
          source: rule.source,
          text: match[0],
          index: match.index,
          end: match.index + match[0].length,
        });

        if (match[0].length === 0) {
          pattern.lastIndex += 1;
        }
      }
    });

    return rawMatches
      .sort((a, b) => {
        const priorityA = a.priority === "high" ? 0 : 1;
        const priorityB = b.priority === "high" ? 0 : 1;
        const lengthDelta = (b.end - b.index) - (a.end - a.index);
        return priorityA - priorityB || lengthDelta || a.index - b.index;
      })
      .reduce((accepted, match) => {
        const overlaps = accepted.some((item) => match.index < item.end && match.end > item.index);
        return overlaps ? accepted : [...accepted, match];
      }, [])
      .sort((a, b) => a.index - b.index);
  }

  function summarizeMatches(matches, text) {
    if (!text.trim()) {
      return {
        status: "unknown",
        title: "Unknown",
        summary: "Paste ingredient text to check this label.",
      };
    }

    if (matches.some((match) => match.priority === "high")) {
      return {
        status: "avoid",
        title: "Avoid",
        summary: "High-priority dimethicone family trigger found in the listed ingredients.",
      };
    }

    if (matches.some((match) => match.source === "silicone")) {
      return {
        status: "review",
        title: "Possible Match",
        summary: "Silicone watchlist ingredient found. Review the label before using this product.",
      };
    }

    if (matches.length > 0) {
      return {
        status: "review",
        title: "Custom Trigger",
        summary: "A custom trigger was found. No silicone watchlist ingredient was found in the text provided.",
      };
    }

    return {
      status: "clear",
      title: "No Listed Match",
      summary: "No silicone trigger was found in the ingredient text provided.",
    };
  }

  function groupMatches(matches) {
    const grouped = new Map();

    matches.forEach((match) => {
      const key = `${match.label}-${match.priority}-${match.group}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          label: match.label,
          priority: match.priority,
          group: match.group,
          source: match.source,
          count: 0,
          examples: new Set(),
        });
      }

      const item = grouped.get(key);
      item.count += 1;
      item.examples.add(match.text);
    });

    return [...grouped.values()];
  }

  globalScope.AllerXDetector = {
    builtInTriggers,
    findMatches,
    summarizeMatches,
    groupMatches,
  };
})(globalThis);
