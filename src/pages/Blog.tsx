import Grid from '../components/widgets/Grid';
import React, { useState } from 'react'
import BlogPost from './BlogPost'

interface Post {
    title: string;
    description: string;
    outline: string;
    sections: {}[];
}

function Blog() {

    const [posts, setPosts] = useState<Post[]>([]);

    const columns = [
        { key: 'topic', label: 'topic' },
        { key: 'title', label: 'Titolo' },
        { key: 'description', label: 'Descrizione' },
        { key: 'sections', label: 'N Sezioni' },
    ];


    return (
        <>
            <h1>Blog</h1>
            <Grid
                records={posts}
                recordId="title"
                columns={columns}
                form={<BlogPost data={{ lang: 'Italiano', voice: 'Informative', style: 'Descriptive', limit: '3' }} />}
            />
        </>
    )
}

export default Blog;
