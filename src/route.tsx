import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { observable, action, toJS } from 'mobx';
import styled from 'styled-components';

interface IOptions {
	resetOnStartUp?: boolean;
}
interface ISegment {
	component: string;
	params: string[];
}
class RouteCtrl {
	public resetOnStartUp: boolean;

	@observable
	public current: string = '';

	@observable
	public segments: ISegment[] = [];

	constructor(options: IOptions) {
		this.resetOnStartUp = options.resetOnStartUp || false;
		this.bindEvent();
	}

	private getRefinePath = (): string => {
		return location.hash.replace(/^#!/, '').replace(/\/$/, '');
	}

	public parent = (num: number): void => {
		const { getRefinePath } = this;
		const segments = getRefinePath().split('/');
		if (num < 0) { // 상대증감
			history.go(num);
		} else { // 즐대증감
			const targetGo = num - (segments.length - 1);
			history.go(targetGo);
		}
	}

	// 마지막 뷰가 같은 컴포넌트면 대체, 아니면 하위로 push
	public move = (segment, withHistory: boolean = false): void => {
		const { getRefinePath } = this;
		const lastSegment = getRefinePath().split('/').pop();
		if (segment.charAt(0) === '/') {
			// go to the root
			this.parent(0); // reset history to root
			this.replace(segment.replace('/', ''), false);
		} else {
			if (lastSegment.split('.')[0] === segment.split('.')[0]) {
				this.replace(segment, withHistory);
			} else {
				this.push(segment);
			}
		}
	}

	public moveWithHistory = (segment): void => {
		this.move(segment, true);
	}

	public push(segment: string): void {
		let targetStr = location.hash;
		if (targetStr.length <= 2) {
			targetStr = '#!';
		}
		targetStr += `/${segment}`;
		location.hash = targetStr;
	}

	public pop(): void {
		history.back();
	}

	public reset(): void {
		location.hash = '';
	}

	public replace(segment: string, withHistory: boolean = false): void {
		const { getRefinePath } = this;
		const segs: string[] = getRefinePath().split('/');
		segs.pop();
		segs.push(segment);
		const hash = `#!/${segs.join('/')}`;
		if (withHistory) {
			location.hash = hash;
		} else {
			location.replace(hash);
		}
	}

	private restorePrevious = (): void => {
		const { getRefinePath } = this;
		const previousHash = getRefinePath();
		this.reset();
		if (!this.resetOnStartUp) {
			// 하나씩 돌면서 push해주기
			previousHash.split('/').filter(r => r !== '').forEach(segment => {
				this.push(segment);
			});
		}
	}

	private parsingSegments = (): void => {
		const { getRefinePath } = this;
		const refinedPath = getRefinePath();

		const newSegments: ISegment[] = [];
		refinedPath.split('/').filter(r => r !== '').forEach(segment => {
			const tmp = segment.split('.');
			const component = tmp.shift();
			const params = tmp.slice();
			newSegments.push({
				component,
				params
			});
		});
		this.segments = newSegments;
	}

	private bindEvent = () => {
		const { restorePrevious, parsingSegments } = this;
		restorePrevious();
		parsingSegments();
		window['onhashchange'] = () => {
			parsingSegments();
		};
		window['route'] = this;
	};
}
export { RouteCtrl };

/**
 * Route Wrapper
 */
const StyledRoute = styled.div`
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
`;
interface IProps {
	comp: React.ReactNode;
	params: string[];
}
const Route: React.FC<IProps> = (props) => {
	const Comp: any = props.comp;
	return (
		<StyledRoute
			className="route-view"
		>
			<Comp params={props.params} />
		</StyledRoute>
	);
};

export default Route;

/**	
 * Modal
 */
const StyledModal = styled.div`
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex: 1;
	overflow: hidden;
	overflow-y: auto;
	.modal-overlay {
		position: fixed;
		background: rgba(0, 0, 0, 0.6);
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.modal-inner {
		margin: auto;
		width: 100%;
		padding: 30px 10px;
		z-index: 1;
		position: relative;
		&.size-xxs {
			max-width: 480px;
		}
		&.size-xs {
			max-width: 767px;
		}
		&.size-sm {
			max-width: 992px;
		}
		&.size-md {
			max-width: 1200px;
		}
		&.size-lg {
			max-width: 1818px;
		}
		&.danger .modal-item-inner-padding {
			background: #c80c0c;
			color: #fff;
		}
		.modal-inner-padding {
			background: #fff;
			padding: 3rem;
		}
	}
`;
const Modal: React.FC<any> = ({ children, ...others }) => {
	const closeModal = () => {
		window['route'].pop();
	}
	return (
		<StyledModal
			className="route-modal"
			{...others}
		>
			<div className="modal-overlay" />
			<div className="modal-inner">
				<div className="modal-inner-padding">
					{children}
				</div>
			</div>
		</StyledModal>
	);
};
export { Modal };