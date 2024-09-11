import { JsonValue, JsonObject } from './types';

export const isJsonObject = (
  value: JsonValue | undefined
): value is JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const formatJsonValue = (value: JsonValue): string => {
  switch (typeof value) {
    case 'string':
      return value;
    case 'number':
    case 'boolean':
      return String(value);
    case 'object':
      if (value === null) return 'null';
      if (Array.isArray(value)) return JSON.stringify(value, null, 2);
      if (isJsonObject(value)) return JSON.stringify(value, null, 2);
      return '';
    default:
      return '';
  }
};

export const formatPath = (path: string[]): string => {
  return path.reduce((acc, key) => {
    if (!isNaN(Number(key))) {
      return `${acc}[${key}]`;
    } else {
      return acc ? `${acc}.${key}` : `${key}`;
    }
  }, '');
};

export const getValueFromPath = (
  data: JsonObject,
  pathParts: string[]
): JsonValue | undefined => {
  let value: JsonValue | undefined = data;

  try {
    for (const key of pathParts) {
      if (isJsonObject(value)) {
        value = value[key as keyof typeof value];
      } else if (Array.isArray(value) && !isNaN(Number(key))) {
        value = value[Number(key)];
      } else {
        value = undefined;
        break;
      }
    }
  } catch (error) {
    console.error('Error traversing path:', error);
    value = undefined;
  }

  return value;
};

export const renderJsonData = (
  data: JsonValue,
  onKeyClick: (path: string[]) => void,
  path: string[] = []
): JSX.Element => {
  if (data === null || data === undefined) {
    return <span>undefined</span>;
  }

  // Handle arrays, but not as clickable
  if (Array.isArray(data)) {
    return (
      <div>
        <span>[</span>
        {data.map((item, index) => (
          <div key={index} style={{ marginLeft: '20px' }}>
            {renderJsonData(item, onKeyClick, [...path, index.toString()])}
            {index < data.length - 1 && <span>,</span>}
          </div>
        ))}
        <span>]</span>
      </div>
    );
  }

  // Handle objects
  if (isJsonObject(data)) {
    return (
      <div>
        <span>{'{'}</span>
        {Object.keys(data).map((key, index, keys) => {
          const value = data[key as keyof typeof data];

          // Enumerate clickable keys
          const isClickable = !(Array.isArray(value) || isJsonObject(value));

          return (
            <div key={key} style={{ marginLeft: '20px' }}>
              <strong
                className={isClickable ? 'json-key' : ''}
                onClick={() => {
                  if (isClickable) {
                    onKeyClick([...path, key]);
                  }
                }}
              >
                "{key}":
              </strong>{' '}
              {renderJsonData(value, onKeyClick, [...path, key])}
              {index < keys.length - 1 && <span>,</span>}
            </div>
          );
        })}
        <span>{'}'}</span>
      </div>
    );
  }

  // Handle strings
  if (typeof data === 'string') {
    return <span>"{data}"</span>;
  }

  // Handle primitives
  return <span>{String(data)}</span>;
};
