import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NavMenu } from './nav-menu.entity';

@Injectable()
export class NavMenusService {
  constructor(
    @InjectRepository(NavMenu)
    private navMenusRepository: Repository<NavMenu>,
  ) { }

  // 获取所有导航菜单
  async findAll(): Promise<NavMenu[]> {
    return this.navMenusRepository.find({
      order: {
        order: 'ASC',
      },
    });
  }

  // 获取启用的导航菜单
  async findActive(): Promise<NavMenu[]> {
    return this.navMenusRepository.find({
      where: {
        isActive: true,
      },
      order: {
        order: 'ASC',
      },
    });
  }

  // 根据ID获取导航菜单
  async findById(id: number): Promise<NavMenu | null> {
    return this.navMenusRepository.findOne({ where: { id } });
  }

  // 创建导航菜单
  async create(navMenuData: Partial<NavMenu>): Promise<NavMenu> {
    const navMenu = this.navMenusRepository.create(navMenuData);
    return this.navMenusRepository.save(navMenu);
  }

  // 更新导航菜单
  async update(id: number, navMenuData: Partial<NavMenu>): Promise<NavMenu | null> {
    const navMenu = await this.findById(id);
    if (!navMenu) {
      return null;
    }

    await this.navMenusRepository.update(id, navMenuData);
    return this.findById(id);
  }

  // 批量更新导航菜单
  async updateAll(navMenus: { id: number; isActive: boolean }[]): Promise<boolean> {
    try {
      for (const menu of navMenus) {
        await this.navMenusRepository.update(menu.id, { isActive: menu.isActive });
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  // 删除导航菜单
  async delete(id: number): Promise<boolean> {
    const result = await this.navMenusRepository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }
}