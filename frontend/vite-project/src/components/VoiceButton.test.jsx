import { fireEvent, render, screen } from '@testing-library/react';
import VoiceButton from './VoiceButton';

describe('VoiceButton', () => {
  it('shows unsupported browser error when SpeechRecognition is unavailable', () => {
    const onTranscript = vi.fn();
    window.SpeechRecognition = undefined;
    window.webkitSpeechRecognition = undefined;

    render(<VoiceButton onTranscript={onTranscript} disabled={false} />);
    fireEvent.click(screen.getByRole('button', { name: /start voice input/i }));

    expect(screen.getByText(/voice not supported/i)).toBeInTheDocument();
    expect(onTranscript).not.toHaveBeenCalled();
  });

  it('calls onTranscript when recognition returns a transcript', () => {
    const onTranscript = vi.fn();

    class MockSpeechRecognition {
      start() {
        this.onresult({ results: [[{ transcript: 'I need help' }]] });
      }
      stop() {}
    }

    window.SpeechRecognition = MockSpeechRecognition;
    window.webkitSpeechRecognition = undefined;

    render(<VoiceButton onTranscript={onTranscript} disabled={false} />);
    fireEvent.click(screen.getByRole('button', { name: /start voice input/i }));

    expect(onTranscript).toHaveBeenCalledWith('I need help');
  });
});
