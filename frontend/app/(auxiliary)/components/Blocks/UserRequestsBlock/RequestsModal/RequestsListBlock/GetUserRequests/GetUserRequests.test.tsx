import {render, screen} from '@testing-library/react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import HelpUserService from "@/app/(auxiliary)/libs/axios/services/HelpUserService/HelpUserService";
import GetUserRequests
    from "@/app/(auxiliary)/components/Blocks/UserRequestsBlock/RequestsModal/RequestsListBlock/GetUserRequests/GetUserRequests";
import "@testing-library/jest-dom/extend-expect"
import "@testing-library/jest-dom"

const mockStore = configureStore({
    reducer: {
        userRequests: () => ({})
    }
});

jest.mock('@/app/(auxiliary)/libs/axios/services/HelpUserService/HelpUserService', () => ({
    HelpUserService: {
        getUserRequests: jest.fn()
    }
}));

describe('GetUserRequests', () => {
    it('should display error message when request fails', async () => {
        (HelpUserService.getUserRequests as jest.Mock).mockResolvedValueOnce({status: 400});

        render(
            <Provider store={mockStore}>
                <GetUserRequests>
                    <div>Children</div>
                </GetUserRequests>
            </Provider>
        );

        expect(await screen.findByText('Не удалось получить список заявок!')).toBeInTheDocument();
    });

    it('should render children when request succeeds', async () => {
        const mockData = {data: {requests: []}};
        (HelpUserService.getUserRequests as jest.Mock).mockResolvedValueOnce({status: 200, data: mockData});

        render(
            <Provider store={mockStore}>
                <GetUserRequests>
                    <div>Children</div>
                </GetUserRequests>
            </Provider>
        );

        expect(await screen.findByText('Children')).toBeInTheDocument();
    });
});

