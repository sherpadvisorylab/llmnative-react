import React from 'react';
import { usePlaygroundContext } from './PlaygroundProvider';
import PlaygroundAccordion from './PlaygroundAccordion';
import PlaygroundPropControl from './PlaygroundPropControl';
import type { PropDef } from './playground.types';

interface PlaygroundControlsProps {
    props: Record<string, any>;
    definitions: PropDef[];
    onUpdateProp: (name: string, value: any) => void;
}

export default function PlaygroundControls({
    props,
    definitions,
    onUpdateProp,
}: PlaygroundControlsProps) {
    const { environment } = usePlaygroundContext();
    const Icon = environment.Icon;
    const controlledProps = definitions.filter((prop) => prop.control !== undefined);
    const visibleProps = (subset: PropDef[]) => subset.filter((prop) => !prop.hidden?.(props));
    const propGroups = controlledProps.reduce<Array<{ name: string; props: PropDef[] }>>((groups, prop) => {
        const groupName = prop.group || 'Props';
        const existing = groups.find((group) => group.name === groupName);
        if (existing) {
            existing.props.push(prop);
        } else {
            groups.push({ name: groupName, props: [prop] });
        }
        return groups;
    }, []);
    const hasPropGroups = propGroups.length > 1 || propGroups.some((group) => group.name !== 'Props');

    if (controlledProps.length === 0) return null;

    return (
        <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Props</p>
            {hasPropGroups
                ? propGroups.map((group, index) => {
                    const visible = visibleProps(group.props);
                    if (visible.length === 0) return null;
                    return (
                        <PlaygroundAccordion key={group.name} Icon={Icon} icon="settings" label={group.name} defaultOpen={index === 0}>
                            <div className="space-y-3 px-1 py-3">
                                {visible.map((prop) => (
                                    <PlaygroundPropControl
                                        key={prop.name}
                                        def={prop}
                                        value={props[prop.name]}
                                        onChange={(next) => onUpdateProp(prop.name, next)}
                                    />
                                ))}
                            </div>
                        </PlaygroundAccordion>
                    );
                })
                : visibleProps(controlledProps).map((prop) => (
                    <PlaygroundPropControl
                        key={prop.name}
                        def={prop}
                        value={props[prop.name]}
                        onChange={(next) => onUpdateProp(prop.name, next)}
                    />
                ))}
        </div>
    );
}
