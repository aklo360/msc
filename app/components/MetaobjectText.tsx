import type {CSSProperties, ReactNode} from 'react';

type MetaobjectTextProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function MetaobjectText({
  children,
  className,
  style,
}: MetaobjectTextProps) {
  return (
    <p
      className={className}
      style={{
        ...style,
        // Shopify multi_line_text_field values arrive as plain strings.
        whiteSpace: 'pre-line',
        overflowWrap: 'break-word',
      }}
    >
      {children}
    </p>
  );
}
