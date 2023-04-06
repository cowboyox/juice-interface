import { twMerge } from 'tailwind-merge'

export const SectionHeading: React.FC<{
  className?: string
  heading: string | JSX.Element
  subheading: string | JSX.Element
}> = ({ className, heading, subheading }) => {
  return (
    <div className="m-auto mb-12 max-w-3xl">
      <h2
        className={twMerge(
          'text-center text-3xl leading-tight text-black md:text-5xl',
          className,
        )}
      >
        {heading}
      </h2>
      <p className="mb-1 text-center text-base text-black dark:text-slate-100">
        {subheading}
      </p>
    </div>
  )
}
