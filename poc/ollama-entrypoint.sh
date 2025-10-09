#!/bin/bash

# Start Ollama in the background
/bin/ollama serve &

# Wait for Ollama to be ready
echo "Waiting for Ollama service to start..."
sleep 5

# Pull the llama3.2 model
echo "Pulling llama3.2 model..."
ollama pull llama3.2

# Keep the container running
wait
