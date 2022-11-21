import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import useMobile from 'hooks/Mobile'
import { ReactNode } from 'react'
import { classNames } from 'utils/classNames'
import { PageContext } from './contexts/PageContext'
import { usePage } from './hooks'
import { PageButtonControl } from './PageButtonControl'
import { Steps } from './Steps'

export interface PageProps {
  className?: string
  name: string
  title?: ReactNode
  description?: ReactNode
}

export const Page: React.FC<PageProps> & {
  ButtonControl: typeof PageButtonControl
} = ({ className, name, title, description, children }) => {
  const isMobile = useMobile()
  const {
    canGoBack,
    isFinalPage,
    isHidden,
    doneText,
    nextPageName,
    goToPreviousPage,
    goToNextPage,
    lockPageProgress,
    unlockPageProgress,
  } = usePage({
    name,
  })

  if (isHidden) return null

  return (
    <PageContext.Provider
      value={{
        pageName: name,
        isHidden,
        canGoBack,
        isFinalPage,
        doneText,
        goToNextPage,
        goToPreviousPage,
        lockPageProgress,
        unlockPageProgress,
      }}
    >
      <Space
        className={classNames('max-w-[600px]', className)}
        direction="vertical"
        size="large"
      >
        <div>
          <div className="flex justify-between">
            <div>
              <h2 className="font-medium text-2xl text-black dark:text-grey-200">
                {title}
              </h2>
              {isMobile && nextPageName && (
                <div className="text-xs font-normal text-grey-500 uppercase pb-6">
                  <Trans>Next:</Trans> {nextPageName}
                </div>
              )}
            </div>{' '}
            {isMobile && <Steps />}
          </div>

          <p>{description}</p>
        </div>
        <div>{children}</div>
      </Space>
    </PageContext.Provider>
  )
}

Page.ButtonControl = PageButtonControl
