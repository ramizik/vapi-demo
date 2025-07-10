import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Perform web search using DuckDuckGo
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results (default: 5)
 * @returns {Promise<Array>} Search results
 */
export async function performWebSearch(query, maxResults = 5) {
  try {
    // DuckDuckGo search URL
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    
    // Make request with headers to avoid blocking
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    // Parse HTML response
    const $ = cheerio.load(response.data);
    const results = [];

    // Extract search results
    $('.result__body').each((index, element) => {
      if (index >= maxResults) return false; // Stop after maxResults

      const $element = $(element);
      const title = $element.find('.result__title a').text().trim();
      const url = $element.find('.result__title a').attr('href');
      const snippet = $element.find('.result__snippet').text().trim();

      if (title && url && snippet) {
        results.push({
          title,
          url: url.startsWith('//') ? `https:${url}` : url,
          snippet,
          source: 'DuckDuckGo'
        });
      }
    });

    return results;
  } catch (error) {
    console.error('Web search error:', error);
    
    // Fallback: return a generic response instead of throwing
    return [{
      title: 'Search temporarily unavailable',
      url: 'https://duckduckgo.com',
      snippet: `I apologize, but I'm unable to perform a web search for "${query}" at the moment. This could be due to network issues or search service limitations. I'll do my best to answer based on my existing knowledge.`,
      source: 'System'
    }];
  }
}

/**
 * Format search results for inclusion in AI prompt
 * @param {Array} results - Search results
 * @returns {string} Formatted text for AI context
 */
export function formatSearchResults(results) {
  if (!results || results.length === 0) {
    return "No search results found.";
  }

  return results
    .map((result, index) => 
      `${index + 1}. **${result.title}**
URL: ${result.url}
${result.snippet}
---`
    )
    .join('\n');
} 