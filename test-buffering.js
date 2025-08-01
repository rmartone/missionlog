// Simple test to verify buffering functionality
import { log } from './dist/index.esm.js';

console.log('Testing log buffering...');

// These calls should be buffered since init() hasn't been called yet
log.info('Buffered message 1');
log.warn('test-tag', 'Buffered message 2');
log.error('Buffered message 3');

console.log('Now initializing logger...');

// Initialize the logger with a callback to see the buffered messages
log.init({
  '*': 'INFO',
  'test-tag': 'TRACE'
}, (level, tag, message, params) => {
  console.log(`[${level}] ${tag ? `[${tag}] ` : ''}${message}`, ...params);
});

// This should log immediately since we're now initialized
log.info('Immediate message after init');

console.log('Test complete!');
