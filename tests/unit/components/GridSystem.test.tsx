import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Col, Row } from '../../../src/components/ui/GridSystem';

describe('GridSystem', () => {
    it('renders semantic row and gutter classes', () => {
        const { container } = render(
            <Row className="g-4">
                <Col>Content</Col>
            </Row>
        );

        const row = container.firstElementChild;
        expect(row).toHaveClass('rf-row');
        expect(row).toHaveClass('g-4');
    });

    it('maps responsive sizes to stable framework classes', () => {
        render(
            <Row>
                <Col md={6} xl={3}>Stat</Col>
            </Row>
        );

        const col = screen.getByText('Stat').closest('.rf-col');
        expect(col).toHaveClass('rf-col');
        expect(col).toHaveClass('rf-col-12');
        expect(col).toHaveClass('rf-col-md-6');
        expect(col).toHaveClass('rf-col-xl-3');
    });

    it('keeps auto columns available for content-sized layouts', () => {
        render(
            <Row>
                <Col xs="auto">Auto</Col>
            </Row>
        );

        const col = screen.getByText('Auto').closest('.rf-col');
        expect(col).toHaveClass('rf-col-auto');
    });
});
