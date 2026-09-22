#!/usr/bin/env bash
input=$(cat)

in=$(echo "$input" | jq -r '.context_window.total_input_tokens // 0')
out=$(echo "$input" | jq -r '.context_window.total_output_tokens // 0')
cache_c=$(echo "$input" | jq -r '.context_window.current_usage.cache_creation_input_tokens // 0')
cache_r=$(echo "$input" | jq -r '.context_window.current_usage.cache_read_input_tokens // 0')

total=$((in + cache_c + cache_r))
printf "🔢 %s tokens total" "$total" "_ out" "$out"