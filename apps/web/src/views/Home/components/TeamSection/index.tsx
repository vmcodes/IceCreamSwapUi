import { Column, Flex, Row } from '@pancakeswap/uikit'
import styles from './team.module.css'
import Image from 'next/image'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { teamData } from './data.ts'

const TeamSection: React.FC = () => {
  return (
    <Row flexDirection={['column', null, null, 'row']} justifyContent="space-around" className={styles.column}>
      {teamData.map((member) => {
        return (
          <Column key={member.name}>
            <div className={styles.card}>
              <div className={styles.content}>
                <div className={styles.front}>
                  <Image src={member.image} alt="person" style={{ height: '70%' }} />
                  <h1 className={styles.heading}>{member.name}</h1>
                  <p className={styles.description}>{member.title}</p>
                </div>
                <div className={styles.back}>
                  <h1 className={styles.heading}>IceCream brings people together</h1>
                  <p className={styles.description}>Multi-chain DeFi solutions</p>
                </div>
              </div>
            </div>
          </Column>
        )
      })}
    </Row>
  )
}

export default TeamSection
