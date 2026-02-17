# Chatbot API Documentation for External Clients

This document explains how external clients (e.g., WordPress chatbots, mobile apps, or third-party integrations) can communicate with the WooVector chatbot server.

## Overview

The WooVector Chatbot API provides an AI-powered conversational interface for e-commerce stores. External clients can send customer messages and receive AI-generated responses.

## Authentication

All API requests require a valid **API Key** that is passed in the URL path.

- **API Key Format**: `wv_[alphanumeric]_[alphanumeric]`
- **Example**: `wv_abc123_xyz456abcdef`

API keys are associated with a vendor store and must be:
- Active (`status: "active"`)
- Have chatbot enabled (`chatbot_enabled: true`)

## Base URL

```
https://your-server.com/api/chatbot/{vendorApiKey}
```

For local development:
```
http://localhost:3000/api/chatbot/{vendorApiKey}
```

## Endpoints

### 1. Check API Status (GET)

Verify that your API key is valid and the chatbot service is active.

**Request:**
```http
GET /api/chatbot/{vendorApiKey}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Chatbot API is active",
  "vendor": {
    "store_name": "My Store",
    "store_url": "https://mystore.com",
    "default_language": "en",
    "chatbot_enabled": true
  },
  "endpoints": {
    "chat": "/api/chatbot/wv_abc123_xyz456",
    "chatStream": "/api/chatbot/wv_abc123_xyz456?stream=true"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid or inactive API key"
}
```

### 2. Send Message (POST - Standard Response)

Send a customer message and receive a complete AI response.

**Request:**
```http
POST /api/chatbot/{vendorApiKey}
Content-Type: application/json

{
  "message": "Ciao, cerco prodotti per la casa",
  "userId": "customer-123",
  "sessionId": "session-abc"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `message` | string | Yes | The customer's message |
| `userId` | string | No | Unique identifier for the customer |
| `sessionId` | string | No | Session identifier for conversation context |

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Ciao! Ho diversi prodotti per la casa disponibili...",
    "intent": "product_search",
    "products": [...]
  },
  "vendor": {
    "store_name": "My Store",
    "store_url": "https://mystore.com"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 3. Send Message (POST - Streaming Response)

For real-time responses, use Server-Sent Events (SSE) streaming.

**Request:**
```http
POST /api/chatbot/{vendorApiKey}?stream=true
Content-Type: application/json

{
  "message": "Ciao, cerco prodotti per la casa",
  "userId": "customer-123",
  "sessionId": "session-abc"
}
```

**Response:**
The response is a stream of Server-Sent Events:

```
data: {"type": "text", "content": "Ciao!"}
data: {"type": "text", "content": " Ho diversi"}
data: {"type": "text", "content": " prodotti per la casa"}
data: {"type": "product", "id": "123", "name": "Lampada Moderna"}
data: [DONE]
```

## Integration Examples

### JavaScript/TypeScript (WordPress, React, etc.)

```javascript
/**
 * Send a message to the chatbot API
 * @param {string} apiKey - Your vendor API key
 * @param {string} message - Customer message
 * @param {string} userId - Unique customer identifier
 * @param {string} sessionId - Session identifier
 * @returns {Promise<Object>} - Chatbot response
 */
async function sendChatMessage(apiKey, message, userId, sessionId) {
  const response = await fetch(`https://your-server.com/api/chatbot/${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      userId,
      sessionId,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

// Usage example
const apiKey = 'wv_abc123_xyz456';
const reply = await sendChatMessage(
  apiKey,
  'Ciao, cosa vendete?',
  'wp-user-123',
  'wp-session-abc'
);

console.log(reply.data.message);
```

### Streaming Example (JavaScript)

```javascript
/**
 * Send a message and receive streaming response
 * @param {string} apiKey - Your vendor API key
 * @param {string} message - Customer message
 * @param {string} userId - Unique customer identifier
 * @param {string} sessionId - Session identifier
 * @param {function} onChunk - Callback for each chunk
 */
async function sendChatMessageStream(apiKey, message, userId, sessionId, onChunk) {
  const response = await fetch(`https://your-server.com/api/chatbot/${apiKey}?stream=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      userId,
      sessionId,
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          return;
        }
        try {
          const parsed = JSON.parse(data);
          onChunk(parsed);
        } catch (e) {
          // Skip invalid JSON
        }
      }
    }
  }
}

// Usage example
await sendChatMessageStream(
  apiKey,
  'Ciao, cerco una lampada',
  'wp-user-123',
  'wp-session-abc',
  (chunk) => {
    if (chunk.type === 'text') {
      console.log(chunk.content);
    } else if (chunk.type === 'product') {
      console.log(`Product: ${chunk.name}`);
    }
  }
);
```

### WordPress Plugin Example (PHP)

```php
<?php
/**
 * Send a message to the WooVector Chatbot API
 * 
 * @param string $api_key Your vendor API key
 * @param string $message Customer message
 * @param string $user_id Unique customer identifier
 * @param string $session_id Session identifier
 * @return array|WP_Error Response data or error
 */
function woovector_send_chat_message($api_key, $message, $user_id = '', $session_id = '') {
    $url = "https://your-server.com/api/chatbot/{$api_key}";
    
    $body = array(
        'message' => $message,
    );
    
    if ($user_id) {
        $body['userId'] = $user_id;
    }
    
    if ($session_id) {
        $body['sessionId'] = $session_id;
    }
    
    $response = wp_remote_post($url, array(
        'headers' => array(
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode($body),
        'timeout' => 30,
    ));
    
    if (is_wp_error($response)) {
        return $response;
    }
    
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    return $data;
}

// Usage example
$api_key = 'wv_abc123_xyz456';
$reply = woovector_send_chat_message(
    $api_key,
    'Ciao, cosa vendete?',
    'wp-user-123',
    'wp-session-abc'
);

if (is_wp_error($reply)) {
    echo 'Error: ' . $reply->get_error_message();
} else {
    echo $reply['data']['message'];
}
?>
```

### cURL Example

```bash
# Check API status
curl -X GET "https://your-server.com/api/chatbot/wv_abc123_xyz456"

# Send a message (non-streaming)
curl -X POST "https://your-server.com/api/chatbot/wv_abc123_xyz456" \
  -H "Content-Type: application/json" \
  -d '{"message": "Ciao, cerco prodotti per la casa", "userId": "customer-123", "sessionId": "session-abc"}'

# Send a message (streaming)
curl -X POST "https://your-server.com/api/chatbot/wv_abc123_xyz456?stream=true" \
  -H "Content-Type: application/json" \
  -d '{"message": "Ciao, cerco prodotti per la casa", "userId": "customer-123", "sessionId": "session-abc"}'
```

## Error Handling

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Missing required parameters |
| 401 | Unauthorized - Invalid or inactive API key |
| 500 | Internal Server Error |

**Error Response Format:**
```json
{
  "success": false,
  "error": "Error message describing the issue"
}
```

## Rate Limits

Rate limits are applied per vendor API key. Contact support for specific rate limit information for your plan.

## Best Practices

1. **Session Management**: Use consistent `sessionId` values to maintain conversation context across multiple messages.

2. **User Identification**: Provide unique `userId` values to enable personalized experiences and conversation history.

3. **Error Handling**: Always check the `success` field in responses and handle errors gracefully.

4. **Timeouts**: Set appropriate timeouts for your requests. Non-streaming requests may take several seconds for complex queries.

5. **Streaming**: Use streaming for better user experience when real-time responses are needed.

## Creating a Test Vendor

To create a test vendor for development, run:

```bash
cd woovector
npx tsx scripts/seed-test-vendor.ts
```

This will create a test vendor with an API key that you can use for testing.

## Support

For questions or issues with the API, contact support at support@your-server.com
