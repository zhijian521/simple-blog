import { StatusPage } from '@/components/ui/status-page';

export default function NotFound() {
    return (
        <StatusPage
            code={404}
            title='页面已随风而逝，了无踪迹'
            subtitle='云深不知处，归径在心间。'
        />
    );
}
