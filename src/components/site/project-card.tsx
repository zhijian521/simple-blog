import { Tag } from '@/components/ui/tag';
import { GhostButton } from '@/components/ui/ghost-button';

import styles from './project-card.module.css';

export interface ProjectAction {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

export interface ProjectCardProps {
    /** 项目图标，传入 SVG 元素 */
    icon?: React.ReactNode;
    /** 项目名称 */
    title: string;
    /** 项目描述 */
    description?: string;
    /** 技术标签列表 */
    tags?: string[];
    /** 操作按钮列表 */
    actions?: ProjectAction[];
}

/*== ProjectCard 项目卡片 — 组合 Tag + GhostButton ==*/
export function ProjectCard({
    icon,
    title,
    description,
    tags,
    actions,
}: ProjectCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    {icon ? <span className={styles.icon}>{icon}</span> : null}
                    <h3 className={styles.title}>{title}</h3>
                </div>
            </div>

            {description ? <p className={styles.copy}>{description}</p> : null}

            {tags && tags.length > 0 ? (
                <div className={styles.tags}>
                    {tags.map((tag) => (
                        <Tag key={tag} size="mini">{tag}</Tag>
                    ))}
                </div>
            ) : null}

            {actions && actions.length > 0 ? (
                <div className={styles.actions}>
                    {actions.map((action) => (
                        <GhostButton
                            href={action.href}
                            icon={action.icon}
                            key={action.label}
                            rel="noreferrer"
                            size="small"
                            target="_blank"
                        >
                            {action.label}
                        </GhostButton>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
