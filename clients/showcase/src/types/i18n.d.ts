interface ShowcaseExampleCopy {
    tab: string;
    title: string;
    description: string;
}

interface ShowcaseExamplesGroup<TItems extends Record<string, ShowcaseExampleCopy>> {
    title: string;
    description: string;
    items: TItems;
}

interface ShowcaseGridDocShortcutCopy {
    label: string;
    help: string;
}

interface ShowcaseGridDocFieldCopy {
    description: string;
    help?: string;
    placeholder?: string;
    shortcuts?: Record<string, ShowcaseGridDocShortcutCopy>;
}

interface ShowcaseGridI18n {
    page: {
        title: string;
        description: string;
    };
    labels: {
        copy: string;
        copied: string;
        name: string;
        email: string;
        role: string;
        status: string;
        team: string;
        city: string;
        contact: string;
        fullName: string;
        activeKey: string;
        none: string;
        selectedCount: string;
        currentOrder: string;
    };
    values: {
        roles: {
            admin: string;
            editor: string;
            viewer: string;
        };
        statuses: {
            active: string;
            review: string;
            inactive: string;
        };
    };
    examples: {
        sources: ShowcaseExamplesGroup<{
            minimal: ShowcaseExampleCopy;
            pathQuery: ShowcaseExampleCopy;
            array: ShowcaseExampleCopy;
            fromUrl: ShowcaseExampleCopy;
        }>;
        columns: ShowcaseExamplesGroup<{
            infer: ShowcaseExampleCopy;
            explicit: ShowcaseExampleCopy;
            render: ShowcaseExampleCopy;
        }>;
        sorting: ShowcaseExamplesGroup<{
            off: ShowcaseExampleCopy;
            someFields: ShowcaseExampleCopy;
            default: ShowcaseExampleCopy;
        }>;
        selection: ShowcaseExamplesGroup<{
            single: ShowcaseExampleCopy;
            multiple: ShowcaseExampleCopy;
        }>;
        actions: ShowcaseExamplesGroup<{
            crudPreset: ShowcaseExampleCopy;
            customKinds: ShowcaseExampleCopy;
            route: ShowcaseExampleCopy;
        }>;
        reorder: {
            title: string;
            description: string;
            manualOrderingTitle: string;
        };
        layout: ShowcaseExamplesGroup<{
            table: ShowcaseExampleCopy;
            gallery: ShowcaseExampleCopy;
        }>;
    };
    selection: {
        chooseOneTitle: string;
        bulkTitle: string;
        exportSelected: string;
        exportSelectedTitle: string;
        payloadTitle: string;
    };
    actions: {
        directoryTitle: string;
        addTeammate: string;
        edit: string;
        delete: string;
        save: string;
        preview: string;
        editTeammate: string;
        deleteTeammateQuestion: string;
        deleteTeammateBody: string;
        deleteTeammateFromMock: string;
        previewTitle: string;
        previewBody: string;
        headerDescription: string;
        roleLabel: string;
        statusLabel: string;
        teamLabel: string;
        cityLabel: string;
        goToCreatePage: string;
        routeActionTitle: string;
    };
    propsDocs: {
        categories: {
            data: string;
            display: string;
            layout: string;
            actions: string;
            behavior: string;
            dataLifecycle: string;
        };
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        titleDefault: string;
        rowClickPayload: string;
        reorderPayload: string;
        reorderPreviewNotice: string;
        props: Record<string, ShowcaseGridDocFieldCopy>;
    };
}

interface ShowcaseCommonI18n {
    nav: {
        docs: string;
        components: string;
        providers: string;
        examples: string;
        benchmark: string;
    };
    groups: {
        foundation: string;
        uiPrimitives: string;
        widgets: string;
        formFields: string;
        blocks: string;
        builtInDrivers: string;
        commonPatterns: string;
        authFlows: string;
    };
    playground: {
        button: string;
        open: string;
    };
    sections: {
        liveDemo: string;
        variants: string;
        basicUsage: string;
        sizes: string;
        configuration: string;
        props: string;
    };
    stub: {
        comingSoon: string;
        underConstruction: string;
    };
}

interface ShowcasePageSectionCopy {
    title: string;
    description?: string;
}

interface ShowcaseAlertI18n {
    page: { title: string; description: string; };
    sections: {
        variants: { description: string; };
        appearance: ShowcasePageSectionCopy;
        withoutIcon: ShowcasePageSectionCopy;
        autoDismiss: ShowcasePageSectionCopy;
        placement: ShowcasePageSectionCopy;
    };
}

interface ShowcaseBadgeI18n {
    page: { title: string; description: string; };
    sections: {
        colorVariants: ShowcasePageSectionCopy;
        overlayAfter: ShowcasePageSectionCopy;
        overlayBefore: ShowcasePageSectionCopy;
        overlayBoth: ShowcasePageSectionCopy;
        overlayDot: ShowcasePageSectionCopy;
        inlineMode: ShowcasePageSectionCopy;
    };
}

interface ShowcaseCardI18n {
    page: { title: string; description: string; };
    sections: {
        basic: ShowcasePageSectionCopy;
        headerFooter: ShowcasePageSectionCopy;
        grid: ShowcasePageSectionCopy;
        loader: ShowcasePageSectionCopy;
    };
}

interface ShowcaseLoaderI18n {
    page: { title: string; description: string; };
    sections: {
        showHide: ShowcasePageSectionCopy;
        custom: ShowcasePageSectionCopy;
        card: ShowcasePageSectionCopy;
        other: ShowcasePageSectionCopy;
    };
}

interface ShowcaseIconI18n {
    page: { title: string; description: string; };
    sections: {
        basicUsage: { description: string; };
        catalog: ShowcasePageSectionCopy;
        sizes: { description: string; };
        colors: ShowcasePageSectionCopy;
        providers: ShowcasePageSectionCopy;
        phosphor: ShowcasePageSectionCopy;
        appConfig: ShowcasePageSectionCopy;
        aliases: ShowcasePageSectionCopy;
        a11y: ShowcasePageSectionCopy;
        customProvider: ShowcasePageSectionCopy;
    };
}

interface ShowcaseBrandI18n {
    page: { title: string; description: string; };
    sections: {
        logoLabel: ShowcasePageSectionCopy;
    };
}

interface ShowcaseCarouselI18n {
    page: { title: string; description: string; };
    sections: {
        slides: ShowcasePageSectionCopy;
    };
}

interface ShowcaseGalleryI18n {
    page: { title: string; description: string; };
    sections: {
        sortedGallery: ShowcasePageSectionCopy;
        recordClick: ShowcasePageSectionCopy;
        bulkSelection: ShowcasePageSectionCopy;
        groupedPaged: ShowcasePageSectionCopy;
    };
    labels: {
        assets: string;
        selectableAssets: string;
        assetsByCategory: string;
        selectedKey: string;
        none: string;
        multiCheckbox: string;
        enableSelectionHelp: string;
        enableMultiCheckbox: string;
        disableMultiCheckbox: string;
        onSelectionPayload: string;
        payloadEmptyHint: string;
        export: string;
        clear: string;
        selectAssetsToEnableBulk: string;
        selectedCount: string;
        selectedGalleryItems: string;
        record: string;
        newBadge: string;
        brandBadge: string;
        reviewBadge: string;
    };
    values: {
        assetNames: {
            hero: string;
            social: string;
            iconset: string;
            launch: string;
            banner: string;
            guide: string;
        };
        categories: {
            brand: string;
            campaign: string;
            docs: string;
        };
        statuses: {
            ready: string;
            draft: string;
            review: string;
        };
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseGridSystemI18n {
    page: { title: string; description: string; };
    sections: {
        equalWidthColumns: ShowcasePageSectionCopy;
        settingOneColumnWidth: ShowcasePageSectionCopy;
        variableWidthContent: ShowcasePageSectionCopy;
        responsiveStack: ShowcasePageSectionCopy;
        containerAndWrapper: ShowcasePageSectionCopy;
    };
    labels: {
        container: string;
        row: string;
        leftCol: string;
        selectedCol: string;
        rightCol: string;
        col: string;
        fluidCol: string;
        equalThree: string;
        equalTwo: string;
        centerFixed: string;
        contentSidebar: string;
        autoMiddle: string;
        autoSideTools: string;
        responsiveSplit: string;
        wrapperRendersDiv: string;
        containerRowCol: string;
        controlledMaxWidth: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
        groups: {
            container: string;
            row: string;
            leftCol: string;
            selectedCol: string;
            rightCol: string;
        };
        props: Record<string, ShowcaseGridDocFieldCopy>;
    };
}

interface ShowcaseTableI18n {
    page: { title: string; description: string; };
    sections: {
        basicTable: ShowcasePageSectionCopy;
        sortableColumns: ShowcasePageSectionCopy;
        responsiveWidth: ShowcasePageSectionCopy;
        internalScroll: ShowcasePageSectionCopy;
        autoHeaders: ShowcasePageSectionCopy;
        recordClick: ShowcasePageSectionCopy;
        bulkSelection: ShowcasePageSectionCopy;
        dragReorder: ShowcasePageSectionCopy;
        footerAndPaging: ShowcasePageSectionCopy;
        groupedRows: ShowcasePageSectionCopy;
    };
    labels: {
        name: string;
        role: string;
        status: string;
        team: string;
        location: string;
        timezone: string;
        selectedKey: string;
        selectedKeys: string;
        selected: string;
        none: string;
        export: string;
        clear: string;
        selectRowsToEnableBulk: string;
        selectedRecords: string;
        note: string;
        dragSortWarningTitle: string;
        dragSortWarningBody: string;
        currentOrder: string;
        footerSummary: string;
        onSelectionPayload: string;
        onReorderPayload: string;
        multiCheckbox: string;
        multiCheckboxHelp: string;
        enableMultiCheckbox: string;
        disableMultiCheckbox: string;
        dragReorder: string;
        dragReorderHelp: string;
        enableDrag: string;
        disableDrag: string;
        selectionPayloadHint: string;
        reorderPayloadHint: string;
        record: string;
    };
    values: {
        roles: {
            admin: string;
            editor: string;
            viewer: string;
        };
        statuses: {
            active: string;
            inactive: string;
            review: string;
        };
        teams: {
            platform: string;
            marketing: string;
            support: string;
            product: string;
            operations: string;
            content: string;
        };
        locations: {
            milanOffice: string;
            berlinHub: string;
            remoteEurope: string;
            madridOffice: string;
        };
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
        defaultFooter: string;
    };
}

interface ShowcaseAuthI18n {
    page: { title: string; description: string; };
    sections: {
        avatarLogin: ShowcasePageSectionCopy;
        integrationConnect: ShowcasePageSectionCopy;
    };
    labels: {
        authButtonPropsTitle: string;
        authButtonPlaygroundTitle: string;
        primaryButtonClasses: string;
        connectDropbox: string;
    };
    propsDocs: {
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
        shortcuts: {
            dropbox: ShowcaseGridDocShortcutCopy;
            drive: ShowcaseGridDocShortcutCopy;
            empty: ShowcaseGridDocShortcutCopy;
        };
    };
}

interface ShowcaseExamplesOverviewI18n {
    page: { title: string; description: string; };
    labels: {
        arrow: string;
    };
    items: {
        crudTable: { title: string; description: string; };
        dashboard: { title: string; description: string; };
        nestedForm: { title: string; description: string; };
        fileManager: { title: string; description: string; };
        googleSignIn: { title: string; description: string; };
    };
}

interface ShowcaseBenchmarkI18n {
    page: { title: string; description: string; };
    labels: {
        seeLive: string;
        tokens: string;
        fewerTokens: string;
        acrossAllScenarios: string;
        savingOf: string;
        plainReact: string;
        whyFewerTokensMatter: string;
    };
    methodology: {
        tokenCountingTitle: string;
        tokenCountingBodyBefore: string;
        tokenCountingLib: string;
        tokenCountingBodyAfter: string;
        fairComparisonsTitle: string;
        fairComparisonsBodyBefore: string;
        fairComparisonsLib: string;
        fairComparisonsBodyMiddle: string;
        fairComparisonsBodyAfter: string;
        representativeSnippetsTitle: string;
        representativeSnippetsBody: string;
    };
    summary: {
        frameworkLabel: string;
        vanillaLabel: string;
    };
    scenarios: {
        crud: {
            title: string;
            description: string;
            tags: {
                grid: string;
                form: string;
                modal: string;
                firebase: string;
            };
            frameworkLabel: string;
            vanillaLabel: string;
        };
        form: {
            title: string;
            description: string;
            tags: {
                form: string;
                input: string;
                select: string;
                validation: string;
            };
            frameworkLabel: string;
            vanillaLabel: string;
        };
        provider: {
            title: string;
            description: string;
            tags: {
                dataProvider: string;
                portsAdapters: string;
            };
            frameworkLabel: string;
            vanillaLabel: string;
            vanillaNote: string;
        };
        auth: {
            title: string;
            description: string;
            tags: {
                auth: string;
                google: string;
                protectedRoute: string;
            };
            frameworkLabel: string;
            vanillaLabel: string;
            vanillaNote: string;
        };
    };
    why: {
        fasterGeneration: {
            title: string;
            description: string;
        };
        lowerCost: {
            title: string;
            description: string;
        };
        higherReliability: {
            title: string;
            description: string;
        };
    };
}

interface ShowcaseCheckboxI18n {
    page: { title: string; description: string; };
    sections: {
        checkedValue: ShowcasePageSectionCopy;
    };
}

interface ShowcaseButtonsI18n {
    page: { title: string; description: string; };
    sections: {
        nativeStates: ShowcasePageSectionCopy;
        outlineLink: ShowcasePageSectionCopy;
        components: ShowcasePageSectionCopy;
    };
    cards: {
        actionButton: string;
        loadingButton: string;
        navigation: string;
    };
}

interface ShowcaseActionButtonI18n {
    page: { title: string; description: string; };
    sections: {
        variants: { description: string; };
        iconLabel: ShowcasePageSectionCopy;
        onClick: ShowcasePageSectionCopy;
        disabled: ShowcasePageSectionCopy;
        badge: ShowcasePageSectionCopy;
    };
}

interface ShowcaseLoadingButtonI18n {
    page: { title: string; description: string; };
    sections: {
        asyncSave: ShowcasePageSectionCopy;
        customLabel: ShowcasePageSectionCopy;
        streaming: ShowcasePageSectionCopy;
        disabled: ShowcasePageSectionCopy;
        controlled: ShowcasePageSectionCopy;
        variants: { description: string; };
    };
}

interface ShowcaseNavigationButtonsI18n {
    page: { title: string; description: string; };
    sections: {
        helpers: ShowcasePageSectionCopy;
    };
}

interface ShowcaseCodeI18n {
    page: { title: string; description: string; };
    sections: {
        tsx: ShowcasePageSectionCopy;
        languages: ShowcasePageSectionCopy;
        themesCopy: ShowcasePageSectionCopy;
        slotsWrapper: ShowcasePageSectionCopy;
    };
}

interface ShowcaseModalPropDoc {
    description: string;
    example?: string;
    typeDetails?: string;
}

interface ShowcaseModalI18n {
    page: { title: string; description: string; };
    sections: {
        positions: ShowcasePageSectionCopy;
    };
    demo: {
        dialogTitleCenter: string;
        panelTitle: string;
        dialogBody: string;
        panelBody: string;
        openButton: string;
        defaultTitle: string;
        defaultBody: string;
    };
    propsDocs: {
        items: Record<string, ShowcaseModalPropDoc>;
    };
}

interface ShowcaseModalYesNoI18n {
    page: { title: string; description: string; };
    sections: {
        destructiveConfirmation: ShowcasePageSectionCopy;
    };
    demo: {
        defaultTitle: string;
        defaultBody: string;
        openButton: string;
        deleteRecordButton: string;
        yesResult: string;
        noResult: string;
        confirmedResult: string;
        cancelledResult: string;
        destructiveQuestion: string;
    };
    propsDocs: {
        items: Record<string, ShowcaseModalPropDoc>;
    };
}

interface ShowcaseModalOkI18n {
    page: { title: string; description: string; };
    sections: {
        statusAcknowledgement: ShowcasePageSectionCopy;
    };
    demo: {
        defaultTitle: string;
        defaultBody: string;
        openButton: string;
        importCsvButton: string;
        acknowledgementBody: string;
    };
    propsDocs: {
        items: Record<string, ShowcaseModalPropDoc>;
    };
}

interface ShowcasePaginationPropDoc {
    description: string;
    help?: string;
    example?: string;
    typeDetails?: string;
}

interface ShowcasePaginationI18n {
    page: { title: string; description: string; };
    sections: {
        interactive: ShowcasePageSectionCopy;
        sticky: ShowcasePageSectionCopy;
    };
    labels: {
        recordPrefix: string;
        stickyPreviewLead: string;
        stickyPreviewMiddle: string;
        stickyPreviewEnd: string;
    };
    propsDocs: {
        items: Record<string, ShowcasePaginationPropDoc>;
    };
    playground: {
        title: string;
        props: Record<string, ShowcasePaginationPropDoc>;
    };
}

interface ShowcasePercentageI18n {
    page: { title: string; description: string; };
    sections: {
        bars: ShowcasePageSectionCopy;
        circles: ShowcasePageSectionCopy;
        normalization: ShowcasePageSectionCopy;
        variants: ShowcasePageSectionCopy;
    };
    labels: {
        completion: string;
        storage: string;
        budgetUsed: string;
        risk: string;
        quality: string;
        coverage: string;
        noText: string;
        revenueTarget: string;
        temperatureRange: string;
        clampedAboveMax: string;
    };
    propsDocs: {
        items: Record<string, ShowcasePaginationPropDoc>;
    };
    playground: {
        title: string;
        defaultLabel: string;
        props: Record<string, ShowcasePaginationPropDoc>;
    };
}

interface ShowcaseLocaleSwitcherI18n {
    page: { title: string; description: string; };
    sections: {
        liveDemo: ShowcasePageSectionCopy;
        nullWhenSingleLocale: ShowcasePageSectionCopy;
        customLabels: ShowcasePageSectionCopy;
        cookiePersistence: ShowcasePageSectionCopy;
        appConfiguration: ShowcasePageSectionCopy;
    };
    labels: {
        language: string;
        italian: string;
        localeBadgeEn: string;
        localeBadgeIt: string;
        localeBadgeDe: string;
        localeBadgeRu: string;
        localeBadgeZh: string;
        localeBadgeAr: string;
    };
    propsDocs: {
        items: Record<string, ShowcasePaginationPropDoc>;
    };
    playground: {
        title: string;
        props: Record<string, ShowcasePaginationPropDoc>;
    };
}

interface ShowcaseTabI18n {
    page: { title: string; description: string; };
    examples: {
        layouts: ShowcaseExamplesGroup<{
            default: ShowcaseExampleCopy;
            top: ShowcaseExampleCopy;
            left: ShowcaseExampleCopy;
            right: ShowcaseExampleCopy;
            bottom: ShowcaseExampleCopy;
        }>;
    };
    labels: {
        general: string;
        advanced: string;
        permissions: string;
        generalSettingsContent: string;
        advancedOptionsContent: string;
        permissionManagementContent: string;
        generalTabContent: string;
        advancedTabContent: string;
        permissionsTabContent: string;
    };
    propsDocs: {
        tabTitle: string;
        tabItemTitle: string;
        tab: {
            items: Record<string, ShowcasePaginationPropDoc>;
        };
        tabItem: {
            items: Record<string, ShowcasePaginationPropDoc>;
        };
    };
    playground: {
        title: string;
    };
}

interface ShowcaseDropdownI18n {
    page: { title: string; description: string; };
    sections: {
        actionMenu: ShowcasePageSectionCopy;
        dataDrivenItems: ShowcasePageSectionCopy;
        toggleBadge: ShowcasePageSectionCopy;
        menuAlignment: ShowcasePageSectionCopy;
        headerFooter: ShowcasePageSectionCopy;
        interactiveContent: ShowcasePageSectionCopy;
        staticMenu: ShowcasePageSectionCopy;
    };
    labels: {
        emptyStateNoItems: string;
        actions: string;
        menu: string;
        footer: string;
        recordActions: string;
        edit: string;
        duplicate: string;
        delete: string;
        dataMenu: string;
        fromMockDb: string;
        notifications: string;
        newMessage: string;
        calendarInvite: string;
        markAllAsRead: string;
        settings: string;
        preferences: string;
        newBadge: string;
        profile: string;
        security: string;
        theme: string;
        workspace: string;
        currentWorkspace: string;
        manageWorkspaces: string;
        switchTo: string;
        designSystem: string;
        dataPlatform: string;
        developerTools: string;
        filters: string;
        filterRecords: string;
        status: string;
        active: string;
        archived: string;
        resetFilters: string;
        quickActions: string;
        viewAll: string;
        createRecord: string;
        importData: string;
        exportReport: string;
        liveBadge: string;
    };
    propsDocs: {
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseMotionI18n {
    page: { title: string; description: string; };
    sections: {
        presetControls: ShowcasePageSectionCopy;
        pressAndOpenStates: ShowcasePageSectionCopy;
        modalAndTabTransitions: ShowcasePageSectionCopy;
        sharedApi: ShowcasePageSectionCopy;
    };
    presets: {
        none: string;
        subtle: string;
        standard: string;
        expressive: string;
    };
    labels: {
        theme: string;
        motionPreset: string;
        saveDraft: string;
        publish: string;
        noMotion: string;
        pressCoverage: string;
        openMenu: string;
        motionAware: string;
        localOverrideActive: string;
        currentPreset: string;
        currentTheme: string;
        effectLocal: string;
        centerDialog: string;
        rightPanel: string;
        notifications: string;
        buttons: string;
        accessibility: string;
        pendingGap: string;
        sharedApiPreview: string;
        motionApiSurface: string;
        centerDialogPreview: string;
        rightPanelPreview: string;
        centerDialogHeader: string;
        rightPanelHeader: string;
        activeTheme: string;
        activePlaygroundPreset: string;
        previewNotice: string;
        durationUnit: string;
        reducedMotionSeparator: string;
    };
    notifications: {
        registryReloaded: { title: string; time: string; };
        modalThemeFallback: { title: string; time: string; };
        reducedMotionRespected: { title: string; time: string; };
    };
    tabContent: {
        buttons: {
            paragraph1: string;
            paragraph2: string;
        };
        accessibility: {
            paragraph1: string;
            paragraph2: string;
        };
        pendingGap: {
            paragraph1: string;
            paragraph2: string;
        };
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcasePaginationPropDoc>;
    };
}

interface ShowcaseListGroupI18n {
    page: { title: string; description: string; };
    sections: {
        statusList: ShowcasePageSectionCopy;
    };
    labels: {
        workflow: string;
        backlog: string;
        inProgress: string;
        review: string;
        done: string;
    };
    propsDocs: {
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseImageAvatarI18n {
    page: { title: string; description: string; };
    sections: {
        sizes: ShowcasePageSectionCopy;
        shapes: ShowcasePageSectionCopy;
        badgeOverlay: ShowcasePageSectionCopy;
        userRow: ShowcasePageSectionCopy;
        placeholderFallback: ShowcasePageSectionCopy;
        caching: ShowcasePageSectionCopy;
    };
    labels: {
        adaLovelace: string;
        bobChen: string;
        carolWu: string;
        circle: string;
        rounded: string;
        square: string;
        ring: string;
        shadow: string;
        online: string;
        away: string;
        offline: string;
        onlineDot: string;
        awayDot: string;
        offlineDot: string;
        counter: string;
        label: string;
        notificationsCountTitle: string;
        newBadge: string;
        engineer: string;
        designer: string;
        productManager: string;
        noSrc: string;
        brokenUrl: string;
        noImage: string;
        user: string;
        srcEmpty: string;
        brokenUrlShort: string;
        firstRender: string;
        nextRender: string;
        cacheHit: string;
    };
    propsDocs: {
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseInputI18n {
    page: { title: string; description: string; };
    sections: {
        textVariants: ShowcasePageSectionCopy;
        numberRange: ShowcasePageSectionCopy;
        dateTime: ShowcasePageSectionCopy;
        colorPicker: ShowcasePageSectionCopy;
        textarea: ShowcasePageSectionCopy;
        checkbox: ShowcasePageSectionCopy;
        disabledReadOnlyAfterSet: ShowcasePageSectionCopy;
    };
    labels: {
        fieldLabel: string;
        typeSomething: string;
        firstName: string;
        email: string;
        password: string;
        website: string;
        age: string;
        score: string;
        birthday: string;
        startTime: string;
        appointment: string;
        week: string;
        month: string;
        brandColor: string;
        bio: string;
        tellUsAboutYourself: string;
        acceptTerms: string;
        recordId: string;
        slug: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseSwitchI18n {
    page: { title: string; description: string; };
    sections: {
        booleanToggle: ShowcasePageSectionCopy;
    };
    labels: {
        published: string;
        togglePublishedState: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseSelectI18n {
    page: { title: string; description: string; };
    sections: {
        basicDropdown: ShowcasePageSectionCopy;
        requiredSelect: ShowcasePageSectionCopy;
        noPlaceholderOption: ShowcasePageSectionCopy;
        readOnlyAfterSet: ShowcasePageSectionCopy;
        dataProviderBacked: ShowcasePageSectionCopy;
    };
    labels: {
        admin: string;
        editor: string;
        viewer: string;
        italy: string;
        germany: string;
        france: string;
        spain: string;
        unitedKingdom: string;
        unitedStates: string;
        category: string;
        chooseCategory: string;
        role: string;
        country: string;
        selectPlaceholder: string;
        chooseRolePlaceholder: string;
        sales: string;
        operations: string;
        support: string;
        draft: string;
        review: string;
        published: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseTextAreaI18n {
    page: { title: string; description: string; };
    sections: {
        basicTextarea: ShowcasePageSectionCopy;
        autoResize: ShowcasePageSectionCopy;
        feedbackPlaceholder: ShowcasePageSectionCopy;
        addons: ShowcasePageSectionCopy;
    };
    labels: {
        notes: string;
        writeShortNote: string;
        initialNote: string;
        bio: string;
        startTyping: string;
        description: string;
        describeIssue: string;
        beSpecific: string;
        signedNote: string;
        note: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseImageUrlI18n {
    page: { title: string; description: string; };
    sections: {
        imageMetadata: ShowcasePageSectionCopy;
    };
    labels: {
        hero: string;
        heroImage: string;
        blueHeroIllustration: string;
        squareThumbnail: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseAutocompleteI18n {
    page: { title: string; description: string; };
    sections: {
        basic: ShowcasePageSectionCopy;
        defaultValues: ShowcasePageSectionCopy;
        tagInput: ShowcasePageSectionCopy;
        creatable: ShowcasePageSectionCopy;
        dataProviderBacked: ShowcasePageSectionCopy;
    };
    labels: {
        aliceJohnson: string;
        bobMartinez: string;
        carlaRossi: string;
        davidKim: string;
        evaMuller: string;
        react: string;
        typeScript: string;
        firebase: string;
        tailwind: string;
        nodeJs: string;
        graphQl: string;
        users: string;
        searchUsers: string;
        typeName: string;
        assignees: string;
        assigneesMaxThree: string;
        technologies: string;
        addTag: string;
        selectOrTypeTag: string;
        persistedTags: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseChecklistI18n {
    page: { title: string; description: string; };
    sections: {
        basic: ShowcasePageSectionCopy;
        permissions: ShowcasePageSectionCopy;
        requiredDisabled: ShowcasePageSectionCopy;
    };
    labels: {
        react: string;
        typeScript: string;
        firebase: string;
        tailwind: string;
        nodeJs: string;
        read: string;
        write: string;
        delete: string;
        admin: string;
        technologies: string;
        selectTechnologies: string;
        permissions: string;
        required: string;
        disabled: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseImageI18n {
    page: { title: string; description: string; };
    sections: {
        basic: ShowcasePageSectionCopy;
        feedbackCaption: ShowcasePageSectionCopy;
        placeholderFallback: ShowcasePageSectionCopy;
        beforeAfter: ShowcasePageSectionCopy;
        fitModes: ShowcasePageSectionCopy;
        fixedDimensions: ShowcasePageSectionCopy;
        styleVariants: ShowcasePageSectionCopy;
        useImageHtml: ShowcasePageSectionCopy;
        useImageJson: ShowcasePageSectionCopy;
    };
    labels: {
        sampleLandscapeIllustration: string;
        hoverTooltip: string;
        captionRenderedBelow: string;
        image: string;
        landscapeIllustration: string;
        heroBanner: string;
        campaignHero: string;
        approved: string;
        noSrcThemeDefault: string;
        customPlaceholder: string;
        missingImage: string;
        heroBannerShort: string;
        ready: string;
        usedInSpringLaunchEmail: string;
        portrait: string;
        thumbnail: string;
        card: string;
        preview: string;
        circleAvatar: string;
        grayscale: string;
        hoverToColorize: string;
        shadow: string;
        imageDensityTitle: string;
        generatedHtmlTag: string;
        imageWidthTitle: string;
        generatedHtmlLcp: string;
        referenceImage: string;
        htmlArrow: string;
        jsonParamsArrow: string;
        cardImage: string;
        copy: string;
        copied: string;
        close: string;
        imageParamsJson: string;
        imageTagHtml: string;
        imageParamsJsonShort: string;
        imageTagHtmlShort: string;
        srcsetDensityActive: string;
        srcsetWidthActive: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
        presets: {
            heroFullWidth: string;
            articleTextColumn: string;
            cardTwoColumns: string;
            cardThreeColumns: string;
            thumbnailSmall: string;
        };
        export: {
            jsonButton: string;
            htmlButton: string;
        };
        props: Record<string, ShowcaseGridDocFieldCopy>;
    };
}

interface ShowcaseNotificationsI18n {
    page: { title: string; description: string; };
    sections: {
        notificationMenu: ShowcasePageSectionCopy;
    };
    labels: {
        newDeploymentCompleted: string;
        storageUsageReached80: string;
        twoMinutesAgo: string;
        oneHourAgo: string;
    };
    propsDocs: {
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
        defaultBadge: string;
    };
}

interface ShowcaseSearchI18n {
    page: { title: string; description: string; };
    sections: {
        searchTrigger: ShowcasePageSectionCopy;
    };
    propsDocs: {
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseMenuI18n {
    page: { title: string; description: string; };
    sections: {
        componentsMenu: ShowcasePageSectionCopy;
    };
    labels: {
        none: string;
        single: string;
        multi: string;
        newBadge: string;
        betaBadge: string;
    };
    propsDocs: {
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseBreadcrumbsI18n {
    page: { title: string; description: string; };
    sections: {
        urlStringTrail: ShowcasePageSectionCopy;
        explicitItemList: ShowcasePageSectionCopy;
        currentRoute: ShowcasePageSectionCopy;
        chevronSeparator: ShowcasePageSectionCopy;
        jsonLdStructuredData: ShowcasePageSectionCopy;
        standaloneSchema: ShowcasePageSectionCopy;
    };
    labels: {
        home: string;
        products: string;
        shoes: string;
        sneakers: string;
        runningShoes: string;
        docs: string;
        components: string;
        breadcrumbs: string;
        jsonLdOutput: string;
        generatedScriptTag: string;
        currentPageOmitted: string;
    };
    propsDocs: {
        items: Record<string, ShowcaseGridDocFieldCopy>;
        schemaTitle: string;
        schemaItems: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
        shortcuts: {
            urlString: string;
            explicitItems: string;
            deepPath: string;
            clear: string;
            stringValue: string;
            withLink: string;
        };
    };
}

interface ShowcaseRepeatI18n {
    page: { title: string; description: string; };
    sections: {
        repeatedFields: ShowcasePageSectionCopy;
    };
    labels: {
        items: string;
        name: string;
        firstItem: string;
        tasks: string;
        taskName: string;
        design: string;
        build: string;
    };
    propsDocs: {
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseTabDynamicI18n {
    page: { title: string; description: string; };
    sections: {
        editableTabs: ShowcasePageSectionCopy;
    };
    labels: {
        section: string;
        dynamicSections: string;
        intro: string;
        title: string;
    };
    propsDocs: {
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseGridPreviewI18n {
    page: { title: string; description: string; };
    banner: {
        currentView: string;
        exportDescription: string;
        previewDescription: string;
        allRecords: string;
        recordPrefix: string;
    };
    sections: {
        datasetPreview: {
            title: string;
            selectedRecordDescription: string;
            emptyDescription: string;
        };
        exportOptions: ShowcasePageSectionCopy;
    };
    emptyState: {
        singleRecordHint: string;
    };
    actions: {
        exportCsv: string;
        exportJson: string;
        saveAsPdf: string;
        copyJson: string;
        jsonCopied: string;
        copyEmails: string;
        emailsCopied: string;
    };
    hints: {
        futureReuse: string;
    };
}

interface ShowcaseHomeI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        quickStart: string;
        uiComponents: string;
    };
    labels: {
        stack: string;
        github: string;
    };
    quickLinks: {
        alert: string;
        badge: string;
        button: string;
        card: string;
        modal: string;
        tab: string;
        table: string;
        pagination: string;
        loader: string;
    };
}

interface ShowcaseImageEditorI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        inlineEditor: ShowcasePageSectionCopy;
        modalEditor: ShowcasePageSectionCopy;
    };
    labels: {
        sampleTitle: string;
        sampleSubtitle: string;
        lastSavedOutput: string;
        savedResultAlt: string;
        openEditorInModal: string;
        editPhoto: string;
        savedResult: string;
        savedAlt: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy & { default?: string }>;
    };
}

interface ShowcaseLayoutBuilderI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        dragFields: ShowcasePageSectionCopy;
    };
    labels: {
        dragFieldsIntoRow: string;
        fields: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy & { default?: string }>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseMarkdownReaderI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        renderedMarkdown: ShowcasePageSectionCopy;
    };
    labels: {
        internalNavigationIntercepted: string;
    };
    demo: {
        content: string;
        metadataTitle: string;
        metadataDescription: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy & { typeDetails?: string }>;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseUploadI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        variants: {
            description: string;
        };
        cloudStorage: ShowcasePageSectionCopy;
    };
    variants: {
        image: {
            title: string;
            description: string;
        };
        document: {
            title: string;
            description: string;
        };
        csv: {
            title: string;
            description: string;
        };
    };
    labels: {
        storageNotice: string;
    };
}

interface ShowcaseUploadImageI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        singleImage: ShowcasePageSectionCopy;
        multipleImages: ShowcasePageSectionCopy;
        editableCrop: ShowcasePageSectionCopy;
        acceptFilter: ShowcasePageSectionCopy;
        responsiveSrcset: ShowcasePageSectionCopy;
    };
    labels: {
        avatar: string;
        galleryMax: string;
        coverPhotoEditable: string;
        pngOnly: string;
        heroImage: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy & { default?: string }>;
    };
    playground: {
        title: string;
        defaultLabel: string;
    };
}

interface ShowcaseUploadDocumentI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        basicUpload: ShowcasePageSectionCopy;
        multipleFiles: ShowcasePageSectionCopy;
        editableFileNames: ShowcasePageSectionCopy;
        acceptFilter: ShowcasePageSectionCopy;
        requiredField: ShowcasePageSectionCopy;
    };
    labels: {
        report: string;
        attachmentsMax: string;
        deliverables: string;
        csvExcelOnly: string;
        contractRequired: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy & { default?: string }>;
    };
    playground: {
        title: string;
        defaultLabel: string;
    };
}

interface ShowcaseUploadCsvI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        basicUpload: ShowcasePageSectionCopy;
        normalizedKeys: ShowcasePageSectionCopy;
        customFieldTransform: ShowcasePageSectionCopy;
        customDelimiter: ShowcasePageSectionCopy;
    };
    labels: {
        emptyState: string;
        rows: string;
        fields: string;
        andMoreRows: string;
        basicLabel: string;
        normalizeLabel: string;
        transformLabel: string;
        delimiterLabel: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy & { default?: string }>;
    };
    playground: {
        title: string;
        defaultLabel: string;
    };
}

interface ShowcasePromptPropShortcutCopy {
    label: string;
    help: string;
}

interface ShowcasePromptPropDocCopy {
    description: string;
    default?: string;
    typeDetails?: string;
    shortcuts?: Record<string, ShowcasePromptPropShortcutCopy>;
}

interface ShowcasePromptSharedI18n {
    propsDocs: {
        groups: {
            shared: string;
            specific: string;
        };
        items: Record<string, ShowcasePromptPropDocCopy>;
    };
    playground: {
        inspector: {
            providerLabel: string;
            providerDescription: string;
            apiKeyPlaceholder: string;
            compatibleBaseUrlPlaceholder: string;
        };
        defaults: {
            projectName: string;
            customerName: string;
            company: string;
            summaryLabel: string;
            summaryPromptLabel: string;
            aiSummaryLabel: string;
            atlasConsole: string;
            northwindRevamp: string;
            shortHumanSummary: string;
            conciseProjectSummary: string;
            followUpEmail: string;
            english: string;
            friendly: string;
            concise: string;
        };
        shortcuts: {
            summary: ShowcasePromptPropShortcutCopy;
            email: ShowcasePromptPropShortcutCopy;
            plain: ShowcasePromptPropShortcutCopy;
            none: ShowcasePromptPropShortcutCopy;
            product: ShowcasePromptPropShortcutCopy;
            customer: ShowcasePromptPropShortcutCopy;
        };
        mockAi: {
            header: string;
            defaultValue: string;
        };
    };
}

interface ShowcasePromptI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        modes: {
            description: string;
        };
    };
    variants: {
        editor: {
            title: string;
            description: string;
        };
        live: {
            title: string;
            description: string;
        };
        plain: {
            title: string;
            description: string;
        };
    };
}

interface ShowcasePromptEditorI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        authorPromptText: ShowcasePageSectionCopy;
        disabledPlainTextarea: ShowcasePageSectionCopy;
        aiUnavailableNotice: ShowcasePageSectionCopy;
    };
    labels: {
        summary: string;
        descriptionField: string;
        customNoticePrefix: string;
        aiProviderNotConfigured: string;
        humanWrittenDescription: string;
        conciseProjectSummary: string;
        shortProjectSummary: string;
    };
    propsDocs: {
        title: string;
    };
    playground: {
        title: string;
    };
}

interface ShowcasePromptLiveI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        aiUnavailableNotice: ShowcasePageSectionCopy;
        runAgainstFormContext: ShowcasePageSectionCopy;
        variablesResolvedPreview: ShowcasePageSectionCopy;
        editModeSettingsToolbar: ShowcasePageSectionCopy;
        multiplePromptsInForm: ShowcasePageSectionCopy;
        customUnavailableNotice: ShowcasePageSectionCopy;
        slashCommands: ShowcasePageSectionCopy;
        attachments: ShowcasePageSectionCopy;
        multimodalInputs: ShowcasePageSectionCopy;
        statusItems: ShowcasePageSectionCopy;
        promptUtils: ShowcasePageSectionCopy;
    };
    labels: {
        summary: string;
        tagline: string;
        productDescription: string;
        meetingNotes: string;
        marketingCopy: string;
        documentSummary: string;
        northwindRevamp: string;
        atlasConsole: string;
        conciseLaunchSummary: string;
        conciseProjectSummary: string;
        punchyTagline: string;
        shortProductDescription: string;
        meetingSummary: string;
        devopsPlatformDescription: string;
        attachedDocumentSummary: string;
        customUnavailableFallback: string;
        tokenCountComment: string;
        contextWindowComment: string;
        contextUsageComment: string;
        costEstimateComment: string;
    };
    propsDocs: {
        title: string;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseFormI18n {
    page: { title: string; description: string; };
    sections: {
        newRecord: ShowcasePageSectionCopy;
        editExisting: ShowcasePageSectionCopy;
        lifecycleHooks: ShowcasePageSectionCopy;
        lifecycleHooksNote: string;
        nestedObjects: ShowcasePageSectionCopy;
    };
}

interface ShowcaseRichTextI18n {
    page: { title: string; description: string; };
    sections: {
        basicUsage: ShowcasePageSectionCopy;
        toolbarModes: ShowcasePageSectionCopy;
        customCommands: ShowcasePageSectionCopy;
        tableSupport: ShowcasePageSectionCopy;
        sourceCode: ShowcasePageSectionCopy;
        statusBar: ShowcasePageSectionCopy;
        outputFormats: ShowcasePageSectionCopy;
        disabledState: ShowcasePageSectionCopy;
        imageUpload: ShowcasePageSectionCopy;
    };
    labels: {
        articleBody: string;
        description: string;
        comment: string;
        notes: string;
        content: string;
        startTyping: string;
        postContent: string;
    };
    propsDocs: {
        title: string;
        items: Record<string, ShowcaseGridDocFieldCopy>;
    };
    playground: { title: string; };
}

interface ShowcaseFormValidationI18n {
    page: { title: string; description: string; };
    sections: {
        createMode: ShowcasePageSectionCopy;
        editMode: ShowcasePageSectionCopy;
        longForm: ShowcasePageSectionCopy;
        longFormHowToTry: string;
        insideModal: ShowcasePageSectionCopy;
    };
}

interface ShowcasePromptPlainI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        fallbackToPlainTextarea: ShowcasePageSectionCopy;
        customRenderFallback: ShowcasePageSectionCopy;
    };
    labels: {
        summary: string;
        notes: string;
        shortHumanSummary: string;
        followUpTwoWeeks: string;
        customFallbackForField: string;
        customFallbackSuffix: string;
    };
    propsDocs: {
        title: string;
    };
    playground: {
        title: string;
    };
}

interface ShowcaseGridArrayI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        basicUsage: ShowcasePageSectionCopy;
        onLoadTransform: ShowcasePageSectionCopy;
        grouping: ShowcasePageSectionCopy;
        selection: ShowcasePageSectionCopy;
    };
    labels: {
        teamMembers: string;
        singleSelection: string;
        multipleSelection: string;
    };
    propsDocs: {
        categories: {
            gridArray: string;
            shared: string;
        };
        items: {
            records: {
                description: string;
            };
            recordId: {
                description: string;
            };
            onLoad: {
                description: string;
            };
        };
    };
    playground: {
        groups: {
            gridArray: string;
            shared: string;
        };
        props: {
            records: {
                description: string;
            };
            recordId: {
                description: string;
                shortcuts: {
                    nativeKey: ShowcaseGridDocShortcutCopy;
                    explicitId: ShowcaseGridDocShortcutCopy;
                    functionId: ShowcaseGridDocShortcutCopy;
                };
            };
            onLoad: {
                description: string;
            };
        };
    };
}

interface ShowcaseGridDbI18n {
    page: {
        title: string;
        description: string;
    };
    sections: {
        basicUsage: ShowcasePageSectionCopy;
        providerFilter: ShowcasePageSectionCopy;
        providerOrder: ShowcasePageSectionCopy;
        fromUrl: ShowcasePageSectionCopy;
        grouping: ShowcasePageSectionCopy;
    };
    labels: {
        teamMembers: string;
    };
    propsDocs: {
        categories: {
            gridDb: string;
            shared: string;
        };
        items: {
            path: {
                description: string;
            };
            fromUrl: {
                description: string;
            };
            recordId: {
                description: string;
            };
            where: {
                description: string;
            };
            order: {
                description: string;
            };
            fieldMap: {
                description: string;
            };
        };
    };
    playground: {
        groups: {
            gridDb: string;
            shared: string;
        };
        props: {
            path: {
                description: string;
            };
            fromUrl: {
                description: string;
            };
            recordId: {
                description: string;
                shortcuts: {
                    nativeKey: ShowcaseGridDocShortcutCopy;
                    explicitId: ShowcaseGridDocShortcutCopy;
                    functionId: ShowcaseGridDocShortcutCopy;
                };
            };
            where: {
                description: string;
                shortcuts: {
                    empty: ShowcaseGridDocShortcutCopy;
                    active: ShowcaseGridDocShortcutCopy;
                    admins: ShowcaseGridDocShortcutCopy;
                };
            };
            order: {
                description: string;
                shortcuts: {
                    none: ShowcaseGridDocShortcutCopy;
                    nameAsc: ShowcaseGridDocShortcutCopy;
                    emailDesc: ShowcaseGridDocShortcutCopy;
                };
            };
            fieldMap: {
                description: string;
                shortcuts: {
                    empty: ShowcaseGridDocShortcutCopy;
                    fullName: ShowcaseGridDocShortcutCopy;
                };
            };
        };
    };
}

declare module '@llmnative/react' {
    interface I18nDict {
        showcase: {
            // ── Navigation ──────────────────────────────────────────────────────
            navDocs:              string;
            navComponents:        string;
            navProviders:         string;
            navExamples:          string;
            navBenchmark:         string;

            // ── Sidebar groups ──────────────────────────────────────────────────
            groupFoundation:      string;
            groupUIPrimitives:    string;
            groupWidgets:         string;
            groupFormFields:      string;
            groupBlocks:          string;
            groupBuiltInDrivers:  string;
            groupCommonPatterns:  string;
            groupAuthFlows:       string;

            // ── Playground shell ────────────────────────────────────────────────
            playgroundButton:     string;
            playgroundOpen:       string;

            // ── Common section labels (reused across pages) ─────────────────────
            sectionLiveDemo:      string;
            sectionVariants:      string;
            sectionBasicUsage:    string;
            sectionSizes:         string;
            sectionConfiguration: string;
            sectionProps:         string;

            // ── Alert page ──────────────────────────────────────────────────────
            alertDesc:                    string;
            alertSectionVariantsDesc:     string;
            alertSectionAppearance:       string;
            alertSectionAppearanceDesc:   string;
            alertSectionWithoutIcon:      string;
            alertSectionAutoDismiss:      string;
            alertSectionAutoDismissDesc:  string;
            alertSectionPlacement:        string;
            alertSectionPlacementDesc:    string;

            // ── Badge page ──────────────────────────────────────────────────────
            badgeDesc:              string;
            badgeColorVariants:     string;
            badgeColorVariantsDesc: string;
            badgeOverlayAfter:      string;
            badgeOverlayAfterDesc:  string;
            badgeOverlayBefore:     string;
            badgeOverlayBeforeDesc: string;
            badgeOverlayBoth:       string;
            badgeOverlayBothDesc:   string;
            badgeOverlayDot:        string;
            badgeOverlayDotDesc:    string;
            badgeInlineMode:        string;
            badgeInlineModeDesc:    string;

            // ── Card page ───────────────────────────────────────────────────────
            cardDesc:                string;
            cardSectionBasic:        string;
            cardSectionHeaderFooter: string;
            cardSectionGrid:         string;
            cardSectionLoader:       string;
            cardSectionLoaderDesc:   string;

            // ── Loader page ─────────────────────────────────────────────────────
            loaderDesc:                string;
            loaderSectionShowHide:     string;
            loaderSectionShowHideDesc: string;
            loaderSectionCustom:       string;
            loaderSectionCustomDesc:   string;
            loaderSectionCard:         string;
            loaderSectionCardDesc:     string;
            loaderSectionOther:        string;
            loaderSectionOtherDesc:    string;

            // ── Icon page ───────────────────────────────────────────────────────
            iconDesc:                    string;
            iconSectionBasicDesc:        string;
            iconSectionCatalog:          string;
            iconSectionCatalogDesc:      string;
            iconSectionSizesDesc:        string;
            iconSectionColors:           string;
            iconSectionColorsDesc:       string;
            iconSectionProviders:        string;
            iconSectionProvidersDesc:    string;
            iconSectionPhosphor:         string;
            iconSectionPhosphorDesc:     string;
            iconSectionAppConfig:        string;
            iconSectionAppConfigDesc:    string;
            iconSectionAliases:          string;
            iconSectionAliasesDesc:      string;
            iconSectionA11y:             string;
            iconSectionA11yDesc:         string;
            iconSectionCustomProvider:   string;
            iconSectionCustomProviderDesc: string;

            // Brand page
            brandDesc:                   string;
            brandSectionLogoLabel:       string;

            // Carousel page
            carouselDesc:                string;
            carouselSectionSlides:       string;

            // Checkbox page
            checkboxDesc:                string;
            checkboxSectionCheckedValue: string;

            // Buttons index page
            buttonsDesc:                 string;
            buttonsSectionNativeStates:  string;
            buttonsSectionNativeStatesDesc: string;
            buttonsSectionOutlineLink:   string;
            buttonsSectionOutlineLinkDesc: string;
            buttonsSectionComponents:    string;
            buttonsSectionComponentsDesc: string;
            buttonsActionButtonCardDesc: string;
            buttonsLoadingButtonCardDesc: string;
            buttonsNavigationCardDesc:   string;

            // ActionButton page
            actionButtonDesc:            string;
            actionButtonSectionVariantsDesc: string;
            actionButtonSectionIconLabel: string;
            actionButtonSectionIconLabelDesc: string;
            actionButtonSectionOnClick:  string;
            actionButtonSectionOnClickDesc: string;
            actionButtonSectionDisabled: string;
            actionButtonSectionDisabledDesc: string;
            actionButtonSectionBadge:    string;
            actionButtonSectionBadgeDesc: string;

            // LoadingButton page
            loadingButtonDesc:                string;
            loadingButtonSectionAsyncSave:    string;
            loadingButtonSectionAsyncSaveDesc: string;
            loadingButtonSectionCustomLabel:  string;
            loadingButtonSectionCustomLabelDesc: string;
            loadingButtonSectionStreaming:    string;
            loadingButtonSectionStreamingDesc: string;
            loadingButtonSectionDisabled:     string;
            loadingButtonSectionDisabledDesc: string;
            loadingButtonSectionControlled:   string;
            loadingButtonSectionControlledDesc: string;
            loadingButtonSectionVariantsDesc: string;

            // Navigation buttons page
            navigationButtonsDesc:            string;
            navigationButtonsSectionHelpers:  string;

            // Code page
            codeDesc:                     string;
            codeSectionTsx:               string;
            codeSectionTsxDesc:           string;
            codeSectionLanguages:         string;
            codeSectionLanguagesDesc:     string;
            codeSectionThemesCopy:        string;
            codeSectionThemesCopyDesc:    string;
            codeSectionSlotsWrapper:      string;
            codeSectionSlotsWrapperDesc:  string;

            // Grid page
            gridDesc:                     string;
            gridCopy:                     string;
            gridCopied:                   string;
            gridSectionSources:           string;
            gridSectionSourcesDesc:       string;
            gridTabMinimal:               string;
            gridTabMinimalTitle:          string;
            gridTabMinimalDesc:           string;
            gridTabPathQuery:             string;
            gridTabPathQueryTitle:        string;
            gridTabPathQueryDesc:         string;
            gridTabArray:                 string;
            gridTabArrayTitle:            string;
            gridTabArrayDesc:             string;
            gridTabFromUrl:               string;
            gridTabFromUrlTitle:          string;
            gridTabFromUrlDesc:           string;
            gridSectionColumns:           string;
            gridSectionColumnsDesc:       string;
            gridTabInfer:                 string;
            gridTabInferTitle:            string;
            gridTabInferDesc:             string;
            gridTabExplicit:              string;
            gridTabExplicitTitle:         string;
            gridTabExplicitDesc:          string;
            gridTabRender:                string;
            gridTabRenderTitle:           string;
            gridTabRenderDesc:            string;
            gridSectionSorting:           string;
            gridSectionSortingDesc:       string;
            gridTabSortingOff:            string;
            gridTabSortingOffTitle:       string;
            gridTabSortingOffDesc:        string;
            gridTabSortingSome:           string;
            gridTabSortingSomeTitle:      string;
            gridTabSortingSomeDesc:       string;
            gridTabSortingDefault:        string;
            gridTabSortingDefaultTitle:   string;
            gridTabSortingDefaultDesc:    string;
            gridSectionSelection:         string;
            gridSectionSelectionDesc:     string;
            gridTabSelectionSingle:       string;
            gridTabSelectionSingleTitle:  string;
            gridTabSelectionSingleDesc:   string;
            gridTabSelectionMultiple:     string;
            gridTabSelectionMultipleTitle:string;
            gridTabSelectionMultipleDesc: string;
            gridChooseOneTitle:           string;
            gridActiveKey:                string;
            gridNone:                     string;
            gridBulkSelectionTitle:       string;
            gridExportSelected:           string;
            gridExportSelectedTitle:      string;
            gridSectionActions:           string;
            gridSectionActionsDesc:       string;
            gridTabCrudPreset:            string;
            gridTabCrudPresetTitle:       string;
            gridTabCrudPresetDesc:        string;
            gridCrudPresetTitle:          string;
            gridTabCustomKinds:           string;
            gridTabCustomKindsTitle:      string;
            gridTabCustomKindsDesc:       string;
            gridActionsTitle:             string;
            gridAddTeammate:              string;
            gridPreview:                  string;
            gridDeleteTeammateBody:       string;
            gridRoleLabel:                string;
            gridStatusLabel:              string;
            gridTeamLabel:                string;
            gridCityLabel:                string;
            gridName:                     string;
            gridEmail:                    string;
            gridRole:                     string;
            gridStatus:                   string;
            gridTeam:                     string;
            gridCity:                     string;
            gridContact:                  string;
            gridFullName:                 string;
            gridAdmin:                    string;
            gridEditor:                   string;
            gridViewer:                   string;
            gridActive:                   string;
            gridReview:                   string;
            gridInactive:                 string;
            gridTeamMembers:              string;
            gridSelectionPayload:         string;
            gridRowClickPayload:          string;
            gridReorderPayload:           string;
            gridReorderPreviewNotice:     string;
            gridEdit:                     string;
            gridDelete:                   string;
            gridSave:                     string;
            gridEditTeammate:             string;
            gridDeleteTeammateQuestion:   string;
            gridDeleteTeammateFromMock:   string;
            gridTeammatePreviewTitle:     string;
            gridTeammatePreviewBody:      string;
            gridActionsHeaderDesc:        string;
            gridSelectedCount:            string;
            gridTabRoute:                 string;
            gridTabRouteTitle:            string;
            gridTabRouteDesc:             string;
            gridRouteActionTitle:         string;
            gridGoToCreatePage:           string;
            gridSectionReorder:           string;
            gridSectionReorderDesc:       string;
            gridManualOrdering:           string;
            gridCurrentOrder:             string;
            gridSectionLayout:            string;
            gridSectionLayoutDesc:        string;
            gridTabLayoutTable:           string;
            gridTabLayoutTableTitle:      string;
            gridTabLayoutTableDesc:       string;
            gridTabLayoutGallery:         string;
            gridTabLayoutGalleryTitle:    string;
            gridTabLayoutGalleryDesc:     string;
            common:                       ShowcaseCommonI18n;
            alert:                        ShowcaseAlertI18n;
            badge:                        ShowcaseBadgeI18n;
            card:                         ShowcaseCardI18n;
            loader:                       ShowcaseLoaderI18n;
            icon:                         ShowcaseIconI18n;
            brand:                        ShowcaseBrandI18n;
            carousel:                     ShowcaseCarouselI18n;
            gallery:                      ShowcaseGalleryI18n;
            gridSystem:                   ShowcaseGridSystemI18n;
            table:                        ShowcaseTableI18n;
            auth:                         ShowcaseAuthI18n;
            examplesOverview:             ShowcaseExamplesOverviewI18n;
            benchmark:                    ShowcaseBenchmarkI18n;
            checkbox:                     ShowcaseCheckboxI18n;
            buttons:                      ShowcaseButtonsI18n;
            actionButton:                 ShowcaseActionButtonI18n;
            loadingButton:                ShowcaseLoadingButtonI18n;
            navigationButtons:            ShowcaseNavigationButtonsI18n;
            code:                         ShowcaseCodeI18n;
            modal:                        ShowcaseModalI18n;
            modalYesNo:                   ShowcaseModalYesNoI18n;
            modalOk:                      ShowcaseModalOkI18n;
            pagination:                   ShowcasePaginationI18n;
            percentage:                   ShowcasePercentageI18n;
            localeSwitcher:               ShowcaseLocaleSwitcherI18n;
            tab:                          ShowcaseTabI18n;
            dropdown:                     ShowcaseDropdownI18n;
            motion:                       ShowcaseMotionI18n;
            listGroup:                    ShowcaseListGroupI18n;
            imageAvatar:                  ShowcaseImageAvatarI18n;
            input:                        ShowcaseInputI18n;
            switch:                       ShowcaseSwitchI18n;
            select:                       ShowcaseSelectI18n;
            textArea:                     ShowcaseTextAreaI18n;
            imageUrl:                     ShowcaseImageUrlI18n;
            autocomplete:                 ShowcaseAutocompleteI18n;
            checklist:                    ShowcaseChecklistI18n;
            image:                        ShowcaseImageI18n;
            notifications:                ShowcaseNotificationsI18n;
            search:                       ShowcaseSearchI18n;
            menu:                         ShowcaseMenuI18n;
            breadcrumbs:                  ShowcaseBreadcrumbsI18n;
            repeat:                       ShowcaseRepeatI18n;
            tabDynamic:                   ShowcaseTabDynamicI18n;
            gridPreview:                  ShowcaseGridPreviewI18n;
            home:                         ShowcaseHomeI18n;
            imageEditor:                  ShowcaseImageEditorI18n;
            layoutBuilder:                ShowcaseLayoutBuilderI18n;
            markdownReader:               ShowcaseMarkdownReaderI18n;
            grid:                         ShowcaseGridI18n;
            gridArray:                    ShowcaseGridArrayI18n;
            gridDb:                       ShowcaseGridDbI18n;
            upload:                       ShowcaseUploadI18n;
            uploadImage:                  ShowcaseUploadImageI18n;
            uploadDocument:               ShowcaseUploadDocumentI18n;
            uploadCsv:                    ShowcaseUploadCsvI18n;
            prompt:                       ShowcasePromptI18n;
            promptShared:                 ShowcasePromptSharedI18n;
            promptEditor:                 ShowcasePromptEditorI18n;
            promptLive:                   ShowcasePromptLiveI18n;
            promptPlain:                  ShowcasePromptPlainI18n;
            form:                         ShowcaseFormI18n;
            formValidation:               ShowcaseFormValidationI18n;
            richText:                     ShowcaseRichTextI18n;
        };
    }
}
