import React from 'react';

export interface Configuration {
  yid?: string;
  start?: string;
  stop?: string;
}

function parseFormData(event: React.FormEvent<HTMLFormElement>): Configuration {
  const form = event.currentTarget
  const formElements = form.elements as typeof form.elements & {
    yid: HTMLInputElement;
    start: HTMLInputElement;
    stop: HTMLInputElement;
  }

  const formData = {
    yid: formElements.yid.value,
    start: formElements.start.value,
    stop: formElements.stop.value,
  }

  return formData;
}

interface UserFormProps {
  yid: string | null;
  start: string | null;
  stop: string | null;
  onSubmit: (arg0: Configuration) => void;
}

export function UserForm({ yid, start, stop, onSubmit }: UserFormProps) {
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const result = parseFormData(event);
    onSubmit(result);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Youtube video id:
          <input
            type="text"
            name="yid"
            defaultValue={yid || ""}
          />
        </label>
        <br />
        <label>
          Video start time:
          <input
            type="number"
            name="start"
            step="any"
            defaultValue={start || ""}
          />
        </label>
        <br />
        <label>
          Video stop time:
          <input
            type="number"
            name="stop"
            step="any"
            defaultValue={stop || ""}
          />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
