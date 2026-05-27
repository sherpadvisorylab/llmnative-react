import React from 'react';
import { Icon } from '@llmnative/react';
import type { PlaygroundIconProps } from '../../docs-kit/playground';

export default function LlmnativeIcon(props: PlaygroundIconProps) {
    return <Icon {...props} style={props.style as any} />;
}
